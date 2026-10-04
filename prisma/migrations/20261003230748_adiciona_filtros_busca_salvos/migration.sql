-- CreateEnum
CREATE TYPE "CombinacaoFiltro" AS ENUM ('TODAS', 'QUALQUER');

-- CreateTable
CREATE TABLE "FiltroBuscaSalvo" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "combinar" "CombinacaoFiltro" NOT NULL DEFAULT 'TODAS',
    "condicoes" JSONB NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiltroBuscaSalvo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FiltroBuscaSalvo_projetoId_usuarioId_idx" ON "FiltroBuscaSalvo"("projetoId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "FiltroBuscaSalvo_projetoId_usuarioId_nome_key" ON "FiltroBuscaSalvo"("projetoId", "usuarioId", "nome");

-- AddForeignKey
ALTER TABLE "FiltroBuscaSalvo" ADD CONSTRAINT "FiltroBuscaSalvo_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiltroBuscaSalvo" ADD CONSTRAINT "FiltroBuscaSalvo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
