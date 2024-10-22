# coding: utf-8
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Table, Text, text
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata

t__SharedProjects = Table(
    '_SharedProjects', metadata,
    Column('A', ForeignKey('Project.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False),
    Column('B', ForeignKey('User.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True),
    Index('_SharedProjects_AB_unique', 'A', 'B', unique=True)
)

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"User_id_seq\"'::regclass)"))
    email = Column(Text, nullable=False, unique=True)
    passwordHash = Column(Text, nullable=False)
    fullName = Column(Text, nullable=False)

    # One-to-Many relationship with Project (Owner)
    projectsOwned = relationship('Project', backref='owner', cascade='all, delete-orphan', foreign_keys='Project.ownerId')

    # Many-to-Many relationship with Project (Shared Projects)
    accessibleProjects = relationship('Project', secondary=t__SharedProjects, backref="sharedWith")


class Project(Base):
    __tablename__ = 'Project'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"Project_id_seq\"'::regclass)"))
    projectName = Column(Text, nullable=False, unique=True)
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    ownerId = Column(ForeignKey('User.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)

    # Relationships
    files = relationship("File", back_populates="project", cascade="all, delete-orphan")

class PrismaMigration(Base):
    __tablename__ = '_prisma_migrations'

    id = Column(String(36), primary_key=True)
    checksum = Column(String(64), nullable=False)
    finished_at = Column(DateTime(True))
    migration_name = Column(String(255), nullable=False)
    logs = Column(Text)
    rolled_back_at = Column(DateTime(True))
    started_at = Column(DateTime(True), nullable=False, server_default=text("now()"))
    applied_steps_count = Column(Integer, nullable=False, server_default=text("0"))


class File(Base):
    __tablename__ = 'File'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"File_id_seq\"'::regclass)"))
    filePath = Column(Text, nullable=False, unique=True)
    uploadedAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    projectId = Column(ForeignKey('Project.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    fileName = Column(Text, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="files")
    reconstructedImage = relationship("ReconstructedImage", uselist=False, back_populates="file")
    imageReconstructionJobs = relationship("ImageReconstructionJob", back_populates="file", cascade="all, delete-orphan")

class ImageReconstructionJob(Base):
    __tablename__ = 'ImageReconstructionJob'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"ImageReconstructionJob_id_seq\"'::regclass)"))
    fileId = Column(ForeignKey('File.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    status = Column(Text, nullable=False, server_default=text("'Pending'::text"))
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    completedAt = Column(TIMESTAMP(precision=3))
    errorMessage = Column(Text)

    # Relationships
    file = relationship("File", back_populates="imageReconstructionJobs")


class ReconstructedImage(Base):
    __tablename__ = 'ReconstructedImage'

    id = Column(Integer, primary_key=True, server_default=text("nextval('\"ReconstructedImage_id_seq\"'::regclass)"))
    imagePath = Column(Text, nullable=False)
    reconstructedAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    fileId = Column(ForeignKey('File.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, unique=True)

    # Relationships
    file = relationship("File", back_populates="reconstructedImage")
    annotations = relationship("Annotation", back_populates="image", cascade="all, delete-orphan")


class Annotation(Base):
    __tablename__ = 'Annotation'

    id = Column(Text, primary_key=True)
    boundingBox = Column(JSONB(astext_type=Text()), nullable=False)
    coordinate = Column(JSONB(astext_type=Text()), nullable=False)
    className = Column(Text, nullable=False)
    createdAt = Column(TIMESTAMP(precision=3), nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    imageId = Column(ForeignKey('ReconstructedImage.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    status = Column(Text, nullable=False, server_default=text("'Not Found'::text"))

    # Relationships
    image = relationship("ReconstructedImage", back_populates="annotations")
