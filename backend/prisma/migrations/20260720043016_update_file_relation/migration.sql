/*
  Warnings:

  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repositoryId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "repositoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
