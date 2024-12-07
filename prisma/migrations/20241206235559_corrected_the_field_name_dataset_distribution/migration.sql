/*
  Warnings:

  - You are about to drop the column `dataSetDistribution` on the `MachineLearningJob` table. All the data in the column will be lost.
  - Added the required column `datasetDistribution` to the `MachineLearningJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MachineLearningJob" DROP COLUMN "dataSetDistribution",
ADD COLUMN     "datasetDistribution" JSONB NOT NULL;
