# Gear Finder

A web application for uploading, reconstructing, and annotating side-scan sonar files (`.xtf` and `.cm2`). It uses Next.js for the frontend/API, PostgreSQL for data storage, RabbitMQ as a message broker, and Celery for background processing of sonar image reconstruction jobs.

---

## Architecture

```
Browser (Next.js - port 3000)
    │
    ├── PostgreSQL (port 5432) ← stores users, projects, files, jobs
    │
    └── RabbitMQ (port 5672)  ← message broker for job queue
            │
            └── Celery Worker ← reconstructs sonar images
                    ▲
            Job Listener script ← polls DB for pending jobs every 2s
```

Reconstructed images are saved to `public/reconstructed/` and served statically at `http://localhost:3000/reconstructed/<filename>.png`.

---

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python](https://www.python.org/) (3.7+) with pip
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or a Python virtual environment (recommended)

---

## First Time Setup

Follow these steps **once** when setting up the project on a new machine.

### Step 1 — Clone the repository

```bash
git clone https://github.com/Taechai/gearfinder.git
cd gearfinder
```

### Step 2 — Configure environment variables

Create a `.env` file at the project root:

```bash
cp .env.example .env   # if .env.example exists, otherwise create it manually
```

Edit `.env` with your own values:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/gearfinderdb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-see-below"
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3 — Configure the Python worker credentials

Open `app/jobs/celery_app.py` and update line 25 with the same credentials you used in `.env`:

```python
DATABASE_URL="postgresql+psycopg2://YOUR_USER:YOUR_PASSWORD@localhost:5432/gearfinderdb"
```

### Step 4 — Start RabbitMQ (Docker)

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

RabbitMQ management UI: http://localhost:15672 (login: `guest` / `guest`)

### Step 5 — Start PostgreSQL (Docker)

Use the same `YOUR_USER` and `YOUR_PASSWORD` you set in `.env`:

```bash
docker run -d --name postgres \
  -e POSTGRES_USER=YOUR_USER \
  -e POSTGRES_PASSWORD=YOUR_PASSWORD \
  -e POSTGRES_DB=gearfinderdb \
  -p 5432:5432 \
  postgres:latest
```

### Step 6 — Install Node.js dependencies

```bash
npm install
```

### Step 7 — Push the database schema

```bash
npx prisma db push
```

This creates all the tables in your PostgreSQL database.

### Step 8 — Install Python dependencies

```bash
pip install celery pyxtf numpy Pillow sqlalchemy psycopg2-binary
```

### Step 9 — Start all services

You need **4 terminals** running simultaneously:

**Terminal 1 — Next.js dev server:**
```bash
npm run dev
```

**Terminal 2 — Celery worker:**
```bash
cd app/jobs
celery -A celery_app worker --loglevel=info --pool=solo
```

**Terminal 3 — Job listener:**
```bash
cd app/jobs
python listen_for_image_reconstruction_jobs.py
```

The app is now available at http://localhost:3000.

---

## Second and Later Runs (Same Machine)

The Docker containers and Node modules already exist — you just need to start everything.

### Step 1 — Start Docker containers

```bash
docker start rabbitmq
docker start postgres
```

Verify they are running:

```bash
docker ps
```

Both `rabbitmq` and `postgres` should appear with status `Up`.

### Step 2 — Start the app (3 terminals)

**Terminal 1 — Next.js:**
```bash
npm run dev
```

**Terminal 2 — Celery worker:**
```bash
cd app/jobs
celery -A celery_app worker --loglevel=info --pool=solo
```

**Terminal 3 — Job listener:**
```bash
cd app/jobs
python listen_for_image_reconstruction_jobs.py
```

The app is available at http://localhost:3000.

---

## Supported File Formats

| Format | Description |
|--------|-------------|
| `.xtf` | Extended Triton Format — processed using `pyxtf` |
| `.cm2` | C-MAX sonar format — processed using the bundled `cm2_extract.py` |

Both formats produce a grayscale waterfall PNG stored in `public/reconstructed/`.

---

## Project Structure

```
gearfinder/
├── app/
│   ├── api/                  # Next.js API routes
│   │   ├── upload/           # File upload endpoint + uploaded-files/
│   │   └── jobs/             # Image reconstruction & ML job endpoints
│   ├── jobs/                 # Python background workers
│   │   ├── celery_app.py     # Celery tasks (XTF + CM2 reconstruction)
│   │   ├── cm2_extract.py    # CM2 file reader/parser
│   │   ├── listen_for_image_reconstruction_jobs.py
│   │   └── models.py         # SQLAlchemy models
│   └── (main)/               # Next.js pages
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   └── reconstructed/        # Output folder for reconstructed images
├── .env                      # Environment variables (not committed)
└── package.json
```

---

## Troubleshooting

**`JWT_SESSION_ERROR` / decryption failed**
- Make sure `NEXTAUTH_SECRET` is set in `.env` and is not empty.
- Clear your browser cookies for `localhost:3000` and log in again.

**Celery `ValueError: not enough values to unpack`**
- This is a Windows-specific issue. Always use `--pool=solo`:
  ```bash
  celery -A celery_app worker --loglevel=info --pool=solo
  ```

**`[Errno 22] Invalid argument` on image save**
- Already fixed — the worker uses `os.path.basename()` and `os.path.join()` for Windows-compatible paths.

**`connection refused` on port 5672 or 5432**
- Your Docker containers are not running. Run `docker start rabbitmq postgres`.

**`prisma db push` fails**
- Make sure the PostgreSQL container is running and the credentials in `.env` match the ones used in `docker run`.
