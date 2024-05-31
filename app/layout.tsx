import type { Metadata } from "next";
import { Gantari } from "next/font/google";
import "./globals.css";

const gantari = Gantari({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/app-logo.png", // /public path
  },
  title: "GearFinder",
  description: "This is an app for Lost Fishing Gears Detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gantari.className} w-screen h-screen`}>
        {children}
      </body>
    </html>
  );
}
