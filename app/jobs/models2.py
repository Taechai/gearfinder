# coding: utf-8
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Table, Text, JSON, text
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata

# Many-to-Many relationship for shared projects
t__SharedProjects = Table(
    '_SharedProjects', metadata,
    Column('A', ForeignKey('Project.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False),
    Column('B', ForeignKey('User.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True),
    Index('_SharedProjects_AB_unique', 'A', 'B', unique=True)
)

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"User_id_seq\"'::regclass)"))
    fullName = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    passwordHash = Column(String, nullable=False)

    # Relationships
    projectsOwned = relationship('Project', backref='owner', cascade='all, delete-orphan', foreign_keys='Project.ownerId')
    accessibleProjects = relationship('Project', secondary=t__SharedProjects, backref="sharedWith")


class Project(Base):
    __tablename__ = 'Project'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"Project_id_seq\"'::regclass)"))
    projectName = Column(String, nullable=False, unique=True)
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    ownerId = Column(ForeignKey('User.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    # Relationships
    files = relationship("File", back_populates="project", cascade="all, delete-orphan")
    machineLearningJobs = relationship("MachineLearningJob", back_populates="project")


class File(Base):
    __tablename__ = 'File'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"File_id_seq\"'::regclass)"))
    filePath = Column(String, nullable=False, unique=True)
    fileName = Column(String, nullable=False)
    uploadedAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    projectId = Column(ForeignKey('Project.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="files")
    reconstructedImage = relationship("ReconstructedImage", uselist=False, back_populates="file")
    imageReconstructionJobs = relationship("ImageReconstructionJob", back_populates="file", cascade="all, delete-orphan")


class ReconstructedImage(Base):
    __tablename__ = 'ReconstructedImage'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"ReconstructedImage_id_seq\"'::regclass)"))
    imagePath = Column(String, nullable=False)
    reconstructedAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    fileId = Column(ForeignKey('File.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, unique=True)

    # Relationships
    file = relationship("File", back_populates="reconstructedImage")
    annotations = relationship("Annotation", back_populates="image", cascade="all, delete-orphan")


class Annotation(Base):
    __tablename__ = 'Annotation'

    id = Column(String, primary_key=True)
    boundingBox = Column(JSONB(astext_type=Text()), nullable=False)
    coordinate = Column(JSONB(astext_type=Text()), nullable=False)
    className = Column(String, nullable=False)
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    imageId = Column(ForeignKey('ReconstructedImage.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    status = Column(String, nullable=False, server_default=text("'Not Found'::text"))

    # Relationships
    image = relationship("ReconstructedImage", back_populates="annotations")


class ImageReconstructionJob(Base):
    __tablename__ = 'ImageReconstructionJob'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"ImageReconstructionJob_id_seq\"'::regclass)"))
    fileId = Column(ForeignKey('File.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    status = Column(String, nullable=False, server_default=text("'Pending'::text"))
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    completedAt = Column(TIMESTAMP(precision=3))
    errorMessage = Column(String)

    # Relationships
    file = relationship("File", back_populates="imageReconstructionJobs")


class MachineLearningJob(Base):
    __tablename__ = 'MachineLearningJob'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"MachineLearningJob_id_seq\"'::regclass)"))
    projectId = Column(ForeignKey('Project.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    datasetDistribution = Column(JSON, nullable=False)
    augmentationParams = Column(JSON, nullable=False)
    status = Column(String, nullable=False, server_default=text("'pending'::text"))
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    completedAt = Column(TIMESTAMP(precision=3))
    errorMessage = Column(String)

    # Relationships
    project = relationship("Project", back_populates="machineLearningJobs")
