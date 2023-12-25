/*
  Warnings:

  - You are about to drop the column `order` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[previousTaskId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "order",
ADD COLUMN     "previousTaskId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Task_previousTaskId_key" ON "Task"("previousTaskId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_previousTaskId_fkey" FOREIGN KEY ("previousTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
