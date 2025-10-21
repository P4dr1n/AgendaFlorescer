-- CreateEnum
CREATE TYPE "DiaDaSemana" AS ENUM ('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');

-- CreateTable
CREATE TABLE "HorarioFuncionamento" (
    "id" TEXT NOT NULL,
    "diaSemana" "DiaDaSemana" NOT NULL,
    "abertura" TEXT NOT NULL,
    "fecho" TEXT NOT NULL,
    "aberto" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HorarioFuncionamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HorarioFuncionamento_diaSemana_key" ON "HorarioFuncionamento"("diaSemana");
