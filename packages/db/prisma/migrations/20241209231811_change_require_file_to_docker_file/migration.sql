/*
  Warnings:

  - You are about to drop the column `requiredFiles` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "requiredFiles",
ADD COLUMN     "dockerFile" TEXT;
