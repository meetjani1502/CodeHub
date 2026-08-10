-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_repositoryId_fkey";

-- CreateTable
CREATE TABLE "FileVersion" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "commitId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
