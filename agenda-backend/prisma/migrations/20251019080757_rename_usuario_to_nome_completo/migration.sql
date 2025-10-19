/*
  Warnings:

  - You are about to drop the column `usuario` on the `User` table. All the data in the column will be lost.
  - Added the required column `nomeCompleto` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_usuario_key";

-- AlterTable
ALTER TABLE "User" RENAME COLUMN "usuario" TO "nomeCompleto";
