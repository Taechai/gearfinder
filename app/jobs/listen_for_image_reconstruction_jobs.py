import asyncio

from sqlalchemy import select
from celery_app import SessionLocal, process_image_reconstruction
from models import *

async def listen_for_new_jobs():
    while True:
        with SessionLocal() as session:
            with session.begin():
                jobs = session.execute(select(ImageReconstructionJob).where(ImageReconstructionJob.status == "pending"))
                jobs = jobs.scalars().all()

                for job in jobs:
                    print(f"Found pending job: {job.id}")
                    process_image_reconstruction.delay(job.id)
                if len(jobs) == 0:
                    print("No pending files")
                print()
        await asyncio.sleep(2)

if __name__ == "__main__":
    # Run the async function in an event loop
    asyncio.run(listen_for_new_jobs())