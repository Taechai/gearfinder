/*
  Warnings:

  - Added the required column `dataSetDistribution` to the `MachineLearningJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MachineLearningJob" ADD COLUMN     "augmentationOptions" JSONB[],
ADD COLUMN     "dataSetDistribution" JSONB NOT NULL;
