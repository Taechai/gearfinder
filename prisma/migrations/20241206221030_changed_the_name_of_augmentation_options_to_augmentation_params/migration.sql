/*
  Warnings:

  - You are about to drop the column `augmentationOptions` on the `MachineLearningJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MachineLearningJob" DROP COLUMN "augmentationOptions",
ADD COLUMN     "augmentationParams" JSONB[];
