/*
  Warnings:

  - A unique constraint covering the columns `[filePath]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fileName" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "File_filePath_key" ON "File"("filePath");
