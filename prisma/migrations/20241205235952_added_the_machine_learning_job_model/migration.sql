-- CreateTable
CREATE TABLE "MachineLearningJob" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "MachineLearningJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MachineLearningJob" ADD CONSTRAINT "MachineLearningJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
