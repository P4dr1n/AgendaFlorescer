-- CreateTable
CREATE TABLE "Servico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "duracao" INTEGER NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
