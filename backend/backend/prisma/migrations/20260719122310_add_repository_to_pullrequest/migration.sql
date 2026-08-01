/*
  Warnings:

  - Added the required column `repositoryId` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN "repositoryId" INTEGER;

-- Backfill: set repositoryId based on the repo of the source branch
UPDATE "PullRequest" pr
SET "repositoryId" = b."repositoryId"
FROM "Branch" b
WHERE pr."sourceBranchId" = b.id;

-- Now enforce NOT NULL
ALTER TABLE "PullRequest" ALTER COLUMN "repositoryId" SET NOT NULL;

-- Add the foreign key
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repositoryId_fkey"
  FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;