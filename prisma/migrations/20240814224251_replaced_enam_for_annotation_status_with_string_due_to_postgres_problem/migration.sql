/*
  Warnings:

  - The `status` column on the `Annotation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Annotation" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Not Found';

-- DropEnum
DROP TYPE "Status";
