/*
  Warnings:

  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('placed', 'acknowledged', 'completed');

-- AlterTable
ALTER TABLE "Lot" ALTER COLUMN "storageDate" DROP NOT NULL,
ALTER COLUMN "expiryDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL;
