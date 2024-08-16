/*
  Warnings:

  - The primary key for the `Annotation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Annotation_id_seq";
