/*
  Warnings:

  - A unique constraint covering the columns `[previousTaskId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_previousTaskId_key" ON "Task"("previousTaskId");
