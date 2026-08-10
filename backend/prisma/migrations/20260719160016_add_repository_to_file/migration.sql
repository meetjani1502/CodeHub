/*
  Warnings:

  - You are about to drop the column `repositoryId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_repositoryId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "repositoryId";

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
