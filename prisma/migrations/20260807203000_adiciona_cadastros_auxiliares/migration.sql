CREATE TABLE "Artista" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "localNascimento" TEXT,
    "anoNascimento" INTEGER,
    "localFalecimento" TEXT,
    "anoFalecimento" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Artista_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StatusObra" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StatusObra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tecnica" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "projetoId" TEXT,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Tecnica_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Artista_empresaId_nome_idx" ON "Artista"("empresaId", "nome");
CREATE UNIQUE INDEX "StatusObra_empresaId_nome_key" ON "StatusObra"("empresaId", "nome");
CREATE INDEX "StatusObra_empresaId_idx" ON "StatusObra"("empresaId");
CREATE INDEX "Tecnica_empresaId_nome_idx" ON "Tecnica"("empresaId", "nome");
CREATE INDEX "Tecnica_projetoId_idx" ON "Tecnica"("projetoId");
CREATE UNIQUE INDEX "Tecnica_geral_empresa_nome_key" ON "Tecnica"("empresaId", "nome") WHERE "projetoId" IS NULL;
CREATE UNIQUE INDEX "Tecnica_projeto_nome_key" ON "Tecnica"("projetoId", "nome") WHERE "projetoId" IS NOT NULL;

ALTER TABLE "Artista" ADD CONSTRAINT "Artista_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StatusObra" ADD CONSTRAINT "StatusObra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Tecnica" ADD CONSTRAINT "Tecnica_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Tecnica" ADD CONSTRAINT "Tecnica_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
