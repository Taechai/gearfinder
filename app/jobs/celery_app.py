# docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# import asyncio
import os
import random
from celery import Celery
import time

from pyxtf import xtf_read, concatenate_channel, XTFHeaderType
import numpy as np
from PIL import Image # type:ignore
from pathlib import Path
from cm2_extract import CM2Reader

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker 
from sqlalchemy import * 
from sqlalchemy.future import * 
from datetime import datetime
from models import ImageReconstructionJob, ReconstructedImage  # Assuming your models are here 

BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'pyamqp://localhost:5672')
app = Celery('celery_app', broker=BROKER_URL)

# Configure SQLAlchemy to connect to your database
DATABASE_URL = os.environ.get('CELERY_DATABASE_URL', 'postgresql+psycopg2://omarayadi:yourpassword@localhost:5432/gearfinderdb')

# Synchronous SQLAlchemy setup
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


# @app.task
# def process_image_reconstruction(job_id: int):
#     with SessionLocal() as session:
#         with session.begin():
#             job:ImageReconstructionJob = session.get(ImageReconstructionJob, job_id)
#             job.status = "in progress"
            
#             file_id = job.file.id
#             file_record = session.get(File, file_id)
#             file_record.reconstructedImage = ReconstructedImage()

#             if not file_record:
#                 print(f"File with ID {file_id} not found")
#                 return

#             img_save_path = f"../../public/reconstructed/{(file_record.filePath.split('/')[-1])[:-4]}.png"
#             img = reconstruct_image(file_record.filePath)
#             img.save(img_save_path)

#             file_record.reconstructedImage.imagePath = f"/reconstructed/{(file_record.filePath.split('/')[-1])[:-4]}.png"
#             session.commit()

#             print(f"Image for {file_id} reconstructed succefully")

@app.task
def process_image_reconstruction(job_id: int):
    try:
        # Step 1: Set job status to 'in progress' and commit it
        with SessionLocal() as session:
            with session.begin():
                # Fetch the job
                job = session.get(ImageReconstructionJob, job_id)
                if not job:
                    print(f"Job with ID {job_id} not found")
                    return
                
                # Update job status to 'in progress'
                job.status = "in progress"

        # Commit the 'in progress' status
        session.commit()

        with SessionLocal() as session:
            with session.begin():
                # Fetch the job
                job = session.get(ImageReconstructionJob, job_id)

                # Fetch the associated file
                file_record = job.file
                if not file_record:
                    print(f"File with ID {file_record.id} not found")
                    job.status = "failed"
                    job.errorMessage = f"File with ID {file_record.id} not found"
                    session.commit()
                    return

                # Create a new ReconstructedImage
                reconstructed_image = ReconstructedImage(fileId=file_record.id)
                file_record.reconstructedImage = reconstructed_image

                # Set image path
                filename_without_ext = os.path.splitext(os.path.basename(file_record.filePath))[0]
                reconstructed_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'reconstructed')
                os.makedirs(reconstructed_dir, exist_ok=True)
                img_save_path = os.path.join(reconstructed_dir, f"{filename_without_ext}.png")

                # Reconstruct based on file type
                file_ext = os.path.splitext(file_record.filePath)[1].lower()
                if file_ext == '.cm2':
                    img = reconstruct_cm2_image(file_record.filePath)
                else:
                    img = reconstruct_image(file_record.filePath)
                img.save(img_save_path)

                # Update the reconstructed image path
                reconstructed_image.imagePath = f"/reconstructed/{filename_without_ext}.png"

                # Mark the job as completed
                job.status = "completed"
                job.completedAt = datetime.utcnow()

            # Commit the changes
            session.commit()

        print(f"Image for file ID {file_record.id} reconstructed successfully")

    except Exception as e:
        # Handle any errors during reconstruction
        print(f"Error processing job ID {job_id}: {str(e)}")

        with SessionLocal() as session:
            with session.begin():
                job = session.get(ImageReconstructionJob, job_id)
                if job:
                    job.status = "failed"
                    job.errorMessage = str(e)
                    job.completedAt = datetime.utcnow()
                session.commit()




def reconstruct_cm2_image(file_path: str):
    reader = CM2Reader(Path(file_path))
    reader.scan()
    pings = reader.read_all()

    if not pings:
        raise ValueError(f"No pings found in CM2 file: {file_path}")

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

    img_array = np.hstack([normalize(port), normalize(stbd)])
    return Image.fromarray(img_array, mode="L")


def reconstruct_image(file_path:str):
    (fh, p) = xtf_read(file_path)
    # Get sonar if present
    if XTFHeaderType.sonar in p:
        upper_limit = 2 ** 16

        # Toggle concatenate_channel weighted argument to fit your data requirements.
        
        np_chan1 = concatenate_channel(p[XTFHeaderType.sonar], file_header=fh, channel=0, weighted=False)
        np_chan2 = concatenate_channel(p[XTFHeaderType.sonar], file_header=fh, channel=1, weighted=False)
        np_chan = np.concatenate((np_chan1, np_chan2), axis=1)
        
        # Clip to range (max cannot be used due to outliers)
        np_chan.clip(0, upper_limit - 1, out=np_chan)
        
        # The sonar data is logarithmic (dB), add small value to avoid log10(0)
        np_chan = np.log10(np_chan + 1, dtype=np.float32)

        # Need to find minimum and maximum value for scaling
        vmin = np_chan.min()
        vmax = np_chan.max()

        # Scaling values to fit datatype uint16
        np_chan_16bit = ((np_chan - vmin) / (vmax - vmin)) * 65535
        np_chan_16bit = np.clip(np_chan_16bit, 0, 65535)

        # Storing image as uint16
        img = Image.fromarray(np_chan_16bit.astype(np.uint16))

        return img