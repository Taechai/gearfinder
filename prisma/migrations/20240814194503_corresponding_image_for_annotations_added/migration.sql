/*
  Warnings:

  - The `status` column on the `Annotation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `imageId` to the `Annotation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NotFound', 'Retrieved', 'ToRetreive');

-- AlterTable
ALTER TABLE "Annotation" ADD COLUMN     "imageId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NotFound';

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ReconstructedImage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
