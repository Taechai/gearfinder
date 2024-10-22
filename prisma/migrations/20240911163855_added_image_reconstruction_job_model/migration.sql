-- CreateTable
CREATE TABLE "ImageReconstructionJob" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "resultImagePath" TEXT,
    "errorMessage" TEXT,

    CONSTRAINT "ImageReconstructionJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageReconstructionJob" ADD CONSTRAINT "ImageReconstructionJob_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
