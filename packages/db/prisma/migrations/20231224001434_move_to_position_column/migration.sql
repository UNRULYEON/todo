/*
  Warnings:

  - You are about to drop the column `previousTaskId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `position` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_previousTaskId_fkey";

-- DropIndex
DROP INDEX "Task_previousTaskId_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "previousTaskId",
ADD COLUMN     "position" BIGINT NOT NULL;
