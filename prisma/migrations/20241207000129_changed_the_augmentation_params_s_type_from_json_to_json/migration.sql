/*
  Warnings:

  - Changed the type of `augmentationParams` on the `MachineLearningJob` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MachineLearningJob" DROP COLUMN "augmentationParams",
ADD COLUMN     "augmentationParams" JSONB NOT NULL;
