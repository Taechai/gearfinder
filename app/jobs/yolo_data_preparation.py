import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models2 import Annotation, ReconstructedImage, File, Project, MachineLearningJob
import random
from PIL import Image
import shutil
import albumentations as A
import cv2

print()
print()
print("IMPORTED LIBRARIES")
print()
print()

# Database configuration
DATABASE_URL = "postgresql+psycopg2://omarayadi:yourpassword@localhost:5432/gearfinderdb"

# YOLO-specific configuration
YOLO_BASE_DIR = "yolo_training_jobs"

def normalize_bbox(bbox, image_width, image_height):
    x_center = (bbox['x'] + bbox['width'] / 2) / image_width
    y_center = (bbox['y'] + bbox['height'] / 2) / image_height
    width = bbox["width"] / image_width
    height = bbox["height"] / image_height
    return x_center, y_center, width, height

def create_transform(augmentationParams):
    transforms = []

    # FLIP
    flip_params = augmentationParams["flip"]["params"]
    if next((p["value"] for p in flip_params if p["name"] == "Horizontal"), False):
        print("Horizontal Flip")
        transforms.append(A.HorizontalFlip())
    if next((p["value"] for p in flip_params if p["name"] == "Vertical"), False):
        print("Veritcal Flip")
        transforms.append(A.VerticalFlip())

    # ROTATION
    rotation_params = augmentationParams["rotation"]["params"]
    rotation_value = next((p["value"] for p in rotation_params if p["name"] == "Angle"), 0)
    include_negative = next((p["value"] for p in rotation_params if p["name"] == "Include negative rotation"), True)
    rotation_range = (-rotation_value, rotation_value) if include_negative else (0, rotation_value)
    if rotation_value > 0:
        print("Rotation Range:", rotation_range)
        transforms.append(A.Rotate(rotation_range))
    
    # NOISE
    noise_params = augmentationParams["noise"]["params"]
    noise_intensity = next((p["value"] for p in noise_params if p["name"] == "Intensity"), 0)
    if noise_intensity > 0:
        print("Noise Intesity:", noise_intensity/100)
        transforms.append(A.GaussNoise((0, noise_intensity/100)))
    
    # BRIGHTNESS
    brightness_params = augmentationParams["brightness"]["params"]
    brightness_value = next((p["value"] for p in brightness_params if p["name"] == "Level"), 0)
    include_darkening = next((p["value"] for p in brightness_params if p["name"] == "Include darkening"), True)
    brightness_range = (-brightness_value / 100, brightness_value / 100) if include_darkening else (0, brightness_value / 100)
    if brightness_value > 0:
        print("Brightness Range:", brightness_range)
        transforms.append(A.RandomBrightnessContrast(brightness_limit=brightness_range))
    
    # CONTRAST
    contrast_params = augmentationParams["contrast"]["params"]
    contrast_value = next((p["value"] for p in contrast_params if p["name"] == "Level"), 0)
    include_negative_contrast = next((p["value"] for p in contrast_params if p["name"] == "Include negative contrast"), True)
    contrast_range = (-contrast_value / 100, contrast_value / 100) if include_negative_contrast else (0, contrast_value / 100)
    if contrast_value > 0:
        print("Contrast Range:", contrast_range)
        transforms.append(A.RandomBrightnessContrast(contrast_limit=contrast_range))

    # BLUR
    blur_params = augmentationParams["blur"]["params"]
    blur_radius = next((p["value"] for p in blur_params if p["name"] == "Radius"), 0)
    if blur_radius > 0:
        print("Blur Range:", (3, int(blur_radius) | 1))
        transforms.append(A.Blur(blur_limit=(3, int(blur_radius) | 1)))  # Ensures odd kernel sizes

    # Hue
    hue_params = augmentationParams["hue"]["params"]
    hue_value = next((p["value"] for p in hue_params if p["name"] == "Level"), 0)
    include_negative = next((p["value"] for p in hue_params if p["name"] == "Include negative hue"), True)
    hue_range = (-hue_value, hue_value) if include_negative else (0, hue_value)
    if hue_value > 0:
        print("Hue Range:", hue_range)
        transforms.append(A.HueSaturationValue(hue_shift_limit=hue_range))
    return A.Compose(transforms)

JOB_ID = 7

# Connect to the database
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Verify if the job exists
job:MachineLearningJob = session.query(MachineLearningJob).filter(MachineLearningJob.id == JOB_ID).first()
if not job:
    raise ValueError(f"MachineLearningJob with ID {JOB_ID} does not exist.")

transform = create_transform(job.augmentationParams)
print()
print("Transform Created Succefully")
print()
assert False
# Verify if the project exists
project_id = job.projectId
project = session.query(Project).filter(Project.id == job.projectId).first()
if not project:
    raise ValueError(f"Project with ID {project_id} does not exist.")

train_split = job.datasetDistribution["train"]["num"]
test_split = job.datasetDistribution["test"]["num"]
validation_split = job.datasetDistribution["validation"]["num"]


# Verify if there are annotated images in the project
images = [file.reconstructedImage for file in project.files if file.reconstructedImage]
if not images:
    raise ValueError("No reconstructed images found in the project.")

annotations_exist = any(
    len(image.annotations) > 0 for image in images if image.annotations
)
if not annotations_exist:
    raise ValueError("No annotated images found in the project.")

print(f"Verified job, project, and annotated images for Job ID {JOB_ID} and Project ID {project_id}.")

# Create train, validation, and test folders with subfolders for images and labels
job_name = f"training_job_{JOB_ID}"  # Incremental folder naming
job_dir = os.path.join(YOLO_BASE_DIR, job_name)
os.makedirs(job_dir, exist_ok=True)

# Create train, test and validation folders
subdirs = ["train", "test", "valid"]
for subdir in subdirs:
    os.makedirs(os.path.join(job_dir, subdir, "images"), exist_ok=True)
    os.makedirs(os.path.join(job_dir, subdir, "labels"), exist_ok=True)

# Dynamically fetch all unique class names from the Annotation table
image_ids = [img.id for img in images]
class_names = session.query(Annotation.className).filter(Annotation.imageId.in_(image_ids)).distinct().all()
class_names = [class_name[0] for class_name in class_names]
CLASSES = {class_name: idx for idx, class_name in enumerate(class_names)}

# Shuffle images
random.shuffle(images)
train_data = images[:train_split]
test_data = images[train_split:train_split + test_split]
validation_data = images[train_split + test_split:]

splits = {"train": train_data, "test": test_data, "valid": validation_data}

# Process each split
for split_name, split_data in splits.items():
    for image in split_data:
        output_image_path = os.path.join(job_dir, split_name, "images", os.path.basename(image.imagePath))
        output_label_path = os.path.join(job_dir, split_name, "labels", os.path.basename(image.imagePath)).replace(".png", ".txt")
        original_image_path = f"../../public{image.imagePath}"

        # Copy images to output path
        os.makedirs(os.path.dirname(output_image_path), exist_ok=True)
        with open(original_image_path, 'rb') as source_file, open(output_image_path, 'wb') as destination_file:
            shutil.copyfileobj(source_file, destination_file)

        # Prepare labels
        labels_list = []
        for annotation in image.annotations:
            bbox = annotation.boundingBox
            image_data = session.query(ReconstructedImage).filter(ReconstructedImage.id == annotation.imageId).first()

            if not image_data:
                continue

            # Get Class ID
            class_id = CLASSES.get(annotation.className, -1)
            if class_id == -1:
                continue

            # Get Image Dimensions
            image_width, image_height = Image.open(original_image_path).size
            x_center, y_center, width, height = normalize_bbox(bbox, image_width, image_height)

            # Add annotation to the list
            labels_list.append(f"{class_id} {x_center} {y_center} {width} {height}\n")

        # Write all labels to the output file
        with open(output_label_path, "w") as label_out:
            label_out.writelines(labels_list)

# Create data.yaml file
data_yaml_path = os.path.join(job_dir, "data.yaml")
with open(data_yaml_path, "w") as yaml_file:
    yaml_content = f"""\
train: {os.path.abspath(os.path.join(job_dir, "train", "images"))}
val: {os.path.abspath(os.path.join(job_dir, "valid", "images"))}
test: {os.path.abspath(os.path.join(job_dir, "test", "images"))}

nc: {len(CLASSES)}  # Number of classes
names: {json.dumps(list(CLASSES.keys()))}  # Class names
"""
    yaml_file.write(yaml_content)

print(f"'data.yaml' created at {data_yaml_path}'\n")

# Verify image and label counts
for split_name, split_data in splits.items():
    images_path = os.path.join(job_dir, split_name, "images")
    labels_path = os.path.join(job_dir, split_name, "labels")

    image_files = os.listdir(images_path)
    label_files = os.listdir(labels_path)

    if len(image_files) != len(label_files):
        print(
            f"Warning: Mismatch in number of images ({len(image_files)}) and labels ({len(label_files)}) in {split_name} split.\n"
        )
    else:
        print(f"{split_name} split is properly prepared.\n")

print("YOLO dataset preparation is complete.")



# DO NOT FORGET DATA AUGMENTATION