/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PullRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_repositoryId_fkey";

-- DropIndex
DROP INDEX "PullRequest_sourceBranchId_idx";

-- DropIndex
DROP INDEX "PullRequest_targetBranchId_idx";

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "PullRequest" DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
