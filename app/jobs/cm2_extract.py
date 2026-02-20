#!/usr/bin/env python3
"""
CM2 Sonar Extractor – Correct & Raw-Accurate

- Correct ping detection
- 16-bit sample handling
- True-resolution waterfall
- GPS extraction
- No artificial resizing or truncation

Author: Chaimae (assisted)
License: MIT
"""

import argparse
import json
import re
from pathlib import Path
from datetime import datetime
import numpy as np
from PIL import Image


# ============================================================
# NMEA PARSER
# ============================================================

class NMEAParser:
    @staticmethod
    def parse_gga(sentence: str):
        try:
            parts = sentence.split(',')
            if len(parts) < 6:
                return None

            lat = None
            lon = None

            if parts[2] and parts[3]:
                d = int(parts[2][:2])
                m = float(parts[2][2:])
                lat = d + m / 60
                if parts[3] == 'S':
                    lat = -lat

            if parts[4] and parts[5]:
                d = int(parts[4][:3])
                m = float(parts[4][3:])
                lon = d + m / 60
                if parts[5] == 'W':
                    lon = -lon

            return {
                "latitude": lat,
                "longitude": lon,
                "time": parts[1] if parts[1] else None
            } if lat and lon else None

        except Exception:
            return None


# ============================================================
# CM2 PING
# ============================================================

class CM2Ping:
    def __init__(self, offset, header, samples):
        self.offset = offset
        self.header = header
        self.samples = samples
        self.gps = None
        self._parse_header()

    def _parse_header(self):
        try:
            text = self.header.decode("ascii", errors="ignore")
            m = re.search(r"\$GPGGA[^\r\n]*", text)
            if m:
                self.gps = NMEAParser.parse_gga(m.group(0))
        except Exception:
            pass

    @property
    def half(self):
        return self.samples.size // 2

    @property
    def port(self):
        return self.samples[:self.half]

    @property
    def starboard(self):
        return self.samples[self.half:]


# ============================================================
# CM2 READER
# ============================================================

class CM2Reader:
    MAGIC = b"CMAX"
    HEADER_SIZE = 256
    SAMPLE_DTYPE = np.uint16

    def __init__(self, path: Path):
        self.path = path
        self.size = path.stat().st_size
        self.offsets = []

    def scan(self):
        self.offsets.clear()
        with open(self.path, "rb") as f:
            data = f.read()

        pos = 0
        while True:
            pos = data.find(self.MAGIC, pos)
            if pos == -1:
                break
            self.offsets.append(pos)
            pos += 4

        return self.offsets

    def read_all(self):
        pings = []
        with open(self.path, "rb") as f:
            for i, start in enumerate(self.offsets):
                end = self.offsets[i + 1] if i + 1 < len(self.offsets) else self.size
                f.seek(start)
                blob = f.read(end - start)

                header = blob[:self.HEADER_SIZE]
                raw = blob[self.HEADER_SIZE:]
                raw = raw[:len(raw) - (len(raw) % 2)]

                samples = np.frombuffer(raw, dtype=self.SAMPLE_DTYPE)
                pings.append(CM2Ping(start, header, samples))

        return pings


# ============================================================
# EXTRACTOR
# ============================================================

class CM2Extractor:
    def __init__(self, cm2: Path, out: Path):
        self.cm2 = cm2
        self.out = out
        self.out.mkdir(exist_ok=True, parents=True)

    def extract(self):
        reader = CM2Reader(self.cm2)
        print("Scanning file...")
        offsets = reader.scan()
        print(f"Found {len(offsets)} pings")

        pings = reader.read_all()
        self._export_images(pings)
        self._export_navigation(pings)
        self._export_metadata(pings)

    # --------------------------------------------------------

    def _export_images(self, pings):
        rows = len(pings)
        max_half = max(p.half for p in pings)

        port = np.zeros((rows, max_half), dtype=np.uint16)
        stbd = np.zeros((rows, max_half), dtype=np.uint16)

        for i, p in enumerate(pings):
            port[i, :p.half] = p.port
            stbd[i, :p.half] = p.starboard

        def normalize(x):
            x = x.astype(np.float32)
            x -= x.min()
            x /= (x.max() + 1e-6)
            return (x * 255).astype(np.uint8)

        # Port side: samples go from nadir (vessel track) outward to left
        # Starboard side: samples go from nadir (vessel track) outward to right
        # MaxView shows: Port (left, no flip) | Center line | Starboard (right, no flip)
        img = np.hstack([
            normalize(port),
            normalize(stbd)
        ])

        out = self.out / f"{self.cm2.stem}_waterfall.png"
        Image.fromarray(img, mode="L").save(out)
        print(f"Saved image: {out.name}  ({img.shape[1]}×{img.shape[0]})")

    # --------------------------------------------------------

    def _export_navigation(self, pings):
        nav = []
        for i, p in enumerate(pings):
            if p.gps:
                nav.append({"ping": i, **p.gps})

        if not nav:
            return

        csv = self.out / "navigation.csv"
        with open(csv, "w") as f:
            f.write("ping,latitude,longitude,time\n")
            for n in nav:
                f.write(f"{n['ping']},{n['latitude']},{n['longitude']},{n['time']}\n")

        print(f"Saved navigation: {csv.name}")

    # --------------------------------------------------------

    def _export_metadata(self, pings):
        meta = {
            "file": self.cm2.name,
            "date": datetime.now().isoformat(),
            "size_mb": round(self.cm2.stat().st_size / 1024 / 1024, 2),
            "pings": len(pings),
            "max_samples_per_side": max(p.half for p in pings)
        }

        out = self.out / "metadata.json"
        with open(out, "w") as f:
            json.dump(meta, f, indent=2)

        print(f"Saved metadata: {out.name}")


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="CM2 sonar extractor")
    parser.add_argument("input", help="CM2 file")
    parser.add_argument("-o", "--output", help="Output directory")

    args = parser.parse_args()
    cm2 = Path(args.input)
    out = Path(args.output) if args.output else Path(f"{cm2.stem}_extracted")

    CM2Extractor(cm2, out).extract()


if __name__ == "__main__":
    main()