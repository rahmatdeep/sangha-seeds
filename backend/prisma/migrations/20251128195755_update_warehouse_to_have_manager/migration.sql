/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Variety` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "assignedManagerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Variety_name_key" ON "Variety"("name");

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_assignedManagerId_fkey" FOREIGN KEY ("assignedManagerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
