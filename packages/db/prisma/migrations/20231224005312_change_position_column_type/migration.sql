/*
  Warnings:

  - You are about to alter the column `position` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "position" SET DATA TYPE INTEGER;
