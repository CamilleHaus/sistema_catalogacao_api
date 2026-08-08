-- CreateTable
CREATE TABLE "CurriculoObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "nomeExposicao" TEXT,
    "instituicao" TEXT,
    "cidade" TEXT,
    "pais" TEXT,
    "data" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CurriculoObra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Publicacao" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "titulo" TEXT,
    "ano" INTEGER,
    "autor" TEXT,
    "editora" TEXT,
    "pagina" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Publicacao_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ImagemPublicacao" (
    "id" TEXT NOT NULL,
    "publicacaoId" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImagemPublicacao_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PesquisaMuseologica" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "titulo" TEXT,
    "descricao" TEXT,
    "url" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PesquisaMuseologica_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PesquisaMuseologica_conteudo_check" CHECK (
      NULLIF(BTRIM("descricao"), '') IS NOT NULL OR NULLIF(BTRIM("url"), '') IS NOT NULL
    )
);

CREATE INDEX "CurriculoObra_obraId_criadoEm_idx" ON "CurriculoObra"("obraId", "criadoEm");
CREATE INDEX "Publicacao_obraId_ano_criadoEm_idx" ON "Publicacao"("obraId", "ano", "criadoEm");
CREATE INDEX "ImagemPublicacao_publicacaoId_criadoEm_idx" ON "ImagemPublicacao"("publicacaoId", "criadoEm");
CREATE INDEX "PesquisaMuseologica_obraId_criadoEm_idx" ON "PesquisaMuseologica"("obraId", "criadoEm");

ALTER TABLE "CurriculoObra" ADD CONSTRAINT "CurriculoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Publicacao" ADD CONSTRAINT "Publicacao_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ImagemPublicacao" ADD CONSTRAINT "ImagemPublicacao_publicacaoId_fkey" FOREIGN KEY ("publicacaoId") REFERENCES "Publicacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PesquisaMuseologica" ADD CONSTRAINT "PesquisaMuseologica_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
