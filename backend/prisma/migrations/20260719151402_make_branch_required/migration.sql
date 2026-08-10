-- 1. Add branchId as nullable
ALTER TABLE "File"
ADD COLUMN "branchId" INTEGER;

-- 2. Set all existing files to branch 1 (main)
UPDATE "File"
SET "branchId" = 1
WHERE "branchId" IS NULL;

-- 3. Make branchId required
ALTER TABLE "File"
ALTER COLUMN "branchId" SET NOT NULL;

-- 4. Add foreign key
ALTER TABLE "File"
ADD CONSTRAINT "File_branchId_fkey"
FOREIGN KEY ("branchId")
REFERENCES "Branch"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;