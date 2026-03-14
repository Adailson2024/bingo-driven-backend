/*
  Warnings:

  - You are about to drop the column `number` on the `numbers` table. All the data in the column will be lost.
  - Added the required column `value` to the `numbers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "numbers" DROP COLUMN "number",
ADD COLUMN     "value" INTEGER NOT NULL;
