-- A migration falhara intencionalmente caso existam projetos duplicados no mesmo cliente.
DROP INDEX IF EXISTS "Projeto_empresaId_nome_key";
CREATE UNIQUE INDEX "Projeto_clienteId_nome_key" ON "Projeto"("clienteId", "nome");

CREATE TABLE "CategoriaCatalogacao" (
  "id" TEXT NOT NULL, "empresaId" TEXT NOT NULL, "nome" TEXT NOT NULL,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CategoriaCatalogacao_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Tag" (
  "id" TEXT NOT NULL, "empresaId" TEXT NOT NULL, "nome" TEXT NOT NULL, "cor" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "LocalAssinatura" (
  "id" TEXT NOT NULL, "empresaId" TEXT NOT NULL, "nome" TEXT NOT NULL,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LocalAssinatura_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Catalogacao" (
  "id" TEXT NOT NULL, "obraId" TEXT NOT NULL, "categoriaId" TEXT, "proveniencia" TEXT, "observacoes" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Catalogacao_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "CatalogacaoTag" (
  "catalogacaoId" TEXT NOT NULL, "tagId" TEXT NOT NULL, "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CatalogacaoTag_pkey" PRIMARY KEY ("catalogacaoId", "tagId")
);
CREATE TABLE "Assinatura" (
  "id" TEXT NOT NULL, "catalogacaoId" TEXT NOT NULL, "localAssinaturaId" TEXT NOT NULL, "imagemUrl" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Certificado" (
  "id" TEXT NOT NULL, "catalogacaoId" TEXT NOT NULL, "imagemUrl" TEXT NOT NULL, "observacoes" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CategoriaCatalogacao_empresaId_nome_key" ON "CategoriaCatalogacao"("empresaId", "nome");
CREATE INDEX "CategoriaCatalogacao_empresaId_idx" ON "CategoriaCatalogacao"("empresaId");
CREATE UNIQUE INDEX "Tag_empresaId_nome_key" ON "Tag"("empresaId", "nome");
CREATE INDEX "Tag_empresaId_idx" ON "Tag"("empresaId");
CREATE UNIQUE INDEX "LocalAssinatura_empresaId_nome_key" ON "LocalAssinatura"("empresaId", "nome");
CREATE INDEX "LocalAssinatura_empresaId_idx" ON "LocalAssinatura"("empresaId");
CREATE UNIQUE INDEX "Catalogacao_obraId_key" ON "Catalogacao"("obraId");
CREATE INDEX "Catalogacao_categoriaId_idx" ON "Catalogacao"("categoriaId");
CREATE INDEX "CatalogacaoTag_tagId_idx" ON "CatalogacaoTag"("tagId");
CREATE INDEX "Assinatura_catalogacaoId_idx" ON "Assinatura"("catalogacaoId");
CREATE INDEX "Assinatura_localAssinaturaId_idx" ON "Assinatura"("localAssinaturaId");
CREATE INDEX "Certificado_catalogacaoId_idx" ON "Certificado"("catalogacaoId");
ALTER TABLE "CategoriaCatalogacao" ADD CONSTRAINT "CategoriaCatalogacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LocalAssinatura" ADD CONSTRAINT "LocalAssinatura_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Catalogacao" ADD CONSTRAINT "Catalogacao_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Catalogacao" ADD CONSTRAINT "Catalogacao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaCatalogacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CatalogacaoTag" ADD CONSTRAINT "CatalogacaoTag_catalogacaoId_fkey" FOREIGN KEY ("catalogacaoId") REFERENCES "Catalogacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CatalogacaoTag" ADD CONSTRAINT "CatalogacaoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_catalogacaoId_fkey" FOREIGN KEY ("catalogacaoId") REFERENCES "Catalogacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_localAssinaturaId_fkey" FOREIGN KEY ("localAssinaturaId") REFERENCES "LocalAssinatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_catalogacaoId_fkey" FOREIGN KEY ("catalogacaoId") REFERENCES "Catalogacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
