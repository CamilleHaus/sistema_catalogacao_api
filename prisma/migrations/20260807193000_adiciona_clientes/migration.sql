CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- Confirmado antes desta migration: não existem projetos cadastrados.
ALTER TABLE "Projeto" ADD COLUMN "clienteId" TEXT NOT NULL;

CREATE INDEX "Cliente_empresaId_nome_idx" ON "Cliente"("empresaId", "nome");
CREATE UNIQUE INDEX "Cliente_empresaId_codigo_key" ON "Cliente"("empresaId", "codigo");
CREATE INDEX "Projeto_clienteId_idx" ON "Projeto"("clienteId");

ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
