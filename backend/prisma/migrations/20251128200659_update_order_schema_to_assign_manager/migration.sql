/*
  Warnings:

  - You are about to drop the `_ManagerOrders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assignedManagerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ManagerOrders" DROP CONSTRAINT "_ManagerOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_ManagerOrders" DROP CONSTRAINT "_ManagerOrders_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "assignedManagerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ManagerOrders";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assignedManagerId_fkey" FOREIGN KEY ("assignedManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
