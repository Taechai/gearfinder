/*
  Warnings:

  - You are about to drop the column `resultImagePath` on the `ImageReconstructionJob` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `ImageReconstructionJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImageReconstructionJob" DROP COLUMN "resultImagePath",
DROP COLUMN "startedAt";
