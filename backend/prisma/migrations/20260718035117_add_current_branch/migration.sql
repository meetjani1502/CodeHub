-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "currentBranchId" INTEGER;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_currentBranchId_fkey" FOREIGN KEY ("currentBranchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
