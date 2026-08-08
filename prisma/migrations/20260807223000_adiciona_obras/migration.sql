CREATE TABLE "Obra" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "numeroManual" TEXT NOT NULL,
    "codigoAcervo" TEXT NOT NULL,
    "titulo" TEXT,
    "edicao" TEXT,
    "data" TEXT,
    "statusId" TEXT,
    "tecnicaId" TEXT,
    "localizacaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Obra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ObraArtista" (
    "obraId" TEXT NOT NULL,
    "artistaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ObraArtista_pkey" PRIMARY KEY ("obraId", "artistaId")
);

CREATE UNIQUE INDEX "Obra_projetoId_codigoAcervo_key" ON "Obra"("projetoId", "codigoAcervo");
CREATE INDEX "Obra_projetoId_idx" ON "Obra"("projetoId");
CREATE INDEX "Obra_statusId_idx" ON "Obra"("statusId");
CREATE INDEX "Obra_tecnicaId_idx" ON "Obra"("tecnicaId");
CREATE INDEX "Obra_localizacaoId_idx" ON "Obra"("localizacaoId");
CREATE INDEX "ObraArtista_artistaId_idx" ON "ObraArtista"("artistaId");

ALTER TABLE "Obra" ADD CONSTRAINT "Obra_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "StatusObra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_tecnicaId_fkey" FOREIGN KEY ("tecnicaId") REFERENCES "Tecnica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ObraArtista" ADD CONSTRAINT "ObraArtista_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ObraArtista" ADD CONSTRAINT "ObraArtista_artistaId_fkey" FOREIGN KEY ("artistaId") REFERENCES "Artista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
