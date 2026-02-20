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

## Running with Docker Compose (recommended)

This is the easiest way to run the project. Everything starts with a single command.

### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### First time setup

**1. Clone the repository**

```bash
git clone https://github.com/Taechai/gearfinder.git
cd gearfinder
```

**2. Create your `.env` file**

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
POSTGRES_USER=gearfinder
POSTGRES_PASSWORD=yourpassword

DATABASE_URL="postgresql://gearfinder:yourpassword@localhost:5432/gearfinderdb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-a-random-hex-string-here"
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Start everything**

```bash
docker compose up --build
```

The `--build` flag is only needed the first time (or after code changes). Docker will:
- Pull RabbitMQ and PostgreSQL images
- Build the Next.js and Python containers
- Push the database schema automatically
- Start all 5 services

The app is available at http://localhost:3000.

---

### Second and later runs (same machine)

Images are already built, so just run:

```bash
docker compose up
```

To stop everything:

```bash
docker compose down
```

> Your database data is preserved in a Docker volume between restarts. To wipe everything and start fresh, run `docker compose down -v`.

---

## Running manually (without Docker Compose)

Use this if you prefer to run services individually, e.g. for debugging.

### Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for RabbitMQ and PostgreSQL)
- [Python](https://www.python.org/) (3.7+) with pip

### First time setup

**1. Clone the repository**

```bash
git clone https://github.com/Taechai/gearfinder.git
cd gearfinder
```

**2. Create your `.env` file**

```bash
cp .env.example .env
```

Edit `.env`:

```env
POSTGRES_USER=gearfinder
POSTGRES_PASSWORD=yourpassword

DATABASE_URL="postgresql://gearfinder:yourpassword@localhost:5432/gearfinderdb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-a-random-hex-string-here"
```

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Start RabbitMQ**

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**4. Start PostgreSQL**

```bash
docker run -d --name postgres \
  -e POSTGRES_USER=gearfinder \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=gearfinderdb \
  -p 5432:5432 \
  postgres:latest
```

**5. Install Node.js dependencies**

```bash
npm install
```

**6. Push the database schema**

```bash
npx prisma db push
```

**7. Install Python dependencies**

```bash
pip install celery pyxtf numpy Pillow sqlalchemy psycopg2-binary
```

**8. Start all services (3 terminals)**

Terminal 1 — Next.js:
```bash
npm run dev
```

Terminal 2 — Celery worker:
```bash
cd app/jobs
celery -A celery_app worker --loglevel=info --pool=solo
```

Terminal 3 — Job listener:
```bash
cd app/jobs
python listen_for_image_reconstruction_jobs.py
```

The app is available at http://localhost:3000.

---

### Second and later runs (manual, same machine)

**1. Start the Docker containers**

```bash
docker start rabbitmq postgres
```

**2. Start the app (3 terminals)**

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
cd app/jobs
celery -A celery_app worker --loglevel=info --pool=solo
```

Terminal 3:
```bash
cd app/jobs
python listen_for_image_reconstruction_jobs.py
```

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
├── Dockerfile                # Next.js container
├── Dockerfile.python         # Python workers container
├── docker-compose.yml        # Orchestrates all services
├── .env                      # Your credentials (not committed)
├── .env.example              # Template to copy from
└── package.json
```

---

## Troubleshooting

**`JWT_SESSION_ERROR` / decryption failed**
- Make sure `NEXTAUTH_SECRET` is set in `.env` and is not empty.
- Clear your browser cookies for `localhost:3000` and log in again.

**Celery `ValueError: not enough values to unpack` (manual run on Windows)**
- Always use `--pool=solo` on Windows:
  ```bash
  celery -A celery_app worker --loglevel=info --pool=solo
  ```

**`connection refused` on port 5672 or 5432 (manual run)**
- Your Docker containers are not running. Run `docker start rabbitmq postgres`.

**`prisma db push` fails**
- Make sure the PostgreSQL container is running and credentials in `.env` match those used in `docker run`.

**Docker Compose build fails**
- Make sure Docker Desktop is running before executing `docker compose up`.
- On first run always use `docker compose up --build`.
