CREATE TABLE "Localizacao" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "paiId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Localizacao_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Localizacao_projetoId_idx" ON "Localizacao"("projetoId");
CREATE INDEX "Localizacao_paiId_idx" ON "Localizacao"("paiId");
CREATE UNIQUE INDEX "Localizacao_projetoId_paiId_nome_key" ON "Localizacao"("projetoId", "paiId", "nome");
-- PostgreSQL considera NULLs distintos; este índice garante nomes únicos também na raiz.
CREATE UNIQUE INDEX "Localizacao_raiz_projeto_nome_key" ON "Localizacao"("projetoId", "nome") WHERE "paiId" IS NULL;

ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_paiId_fkey" FOREIGN KEY ("paiId") REFERENCES "Localizacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
