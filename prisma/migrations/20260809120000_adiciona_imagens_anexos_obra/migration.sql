CREATE TYPE "TipoArquivoAnexo" AS ENUM ('IMAGEM', 'PDF', 'DOCUMENTO', 'PLANILHA', 'APRESENTACAO', 'AUDIO', 'VIDEO', 'OUTRO');

CREATE TABLE "ImagemObra" (
  "id" TEXT NOT NULL,
  "obraId" TEXT NOT NULL,
  "imagemUrl" TEXT NOT NULL,
  "creditos" TEXT,
  "observacoes" TEXT,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ImagemObra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnexoObra" (
  "id" TEXT NOT NULL,
  "obraId" TEXT NOT NULL,
  "arquivoUrl" TEXT NOT NULL,
  "tipo" "TipoArquivoAnexo" NOT NULL,
  "observacoes" TEXT,
  "nomeOriginal" TEXT NOT NULL,
  "extensao" TEXT,
  "mimeType" TEXT NOT NULL,
  "tamanhoBytes" BIGINT NOT NULL,
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizadoEm" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AnexoObra_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Obra" ADD COLUMN "imagemPrincipalId" TEXT;
CREATE UNIQUE INDEX "Obra_imagemPrincipalId_key" ON "Obra"("imagemPrincipalId");
CREATE INDEX "ImagemObra_obraId_criadoEm_idx" ON "ImagemObra"("obraId", "criadoEm");
CREATE INDEX "AnexoObra_obraId_criadoEm_idx" ON "AnexoObra"("obraId", "criadoEm");
CREATE INDEX "AnexoObra_tipo_idx" ON "AnexoObra"("tipo");
ALTER TABLE "ImagemObra" ADD CONSTRAINT "ImagemObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnexoObra" ADD CONSTRAINT "AnexoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_imagemPrincipalId_fkey" FOREIGN KEY ("imagemPrincipalId") REFERENCES "ImagemObra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill idempotente: reaproveita a URL, sem copiar o arquivo externo.
INSERT INTO "ImagemObra" ("id", "obraId", "imagemUrl", "criadoEm", "atualizadoEm")
SELECT gen_random_uuid()::text, o."id", o."fotoPrincipalUrl", o."criadoEm", CURRENT_TIMESTAMP
FROM "Obra" o
WHERE o."fotoPrincipalUrl" IS NOT NULL
  AND btrim(o."fotoPrincipalUrl") <> ''
  AND NOT EXISTS (
    SELECT 1 FROM "ImagemObra" i
    WHERE i."obraId" = o."id" AND i."imagemUrl" = o."fotoPrincipalUrl"
  );

UPDATE "Obra" o
SET "imagemPrincipalId" = (
  SELECT img."id" FROM "ImagemObra" img
  WHERE img."obraId" = o."id" AND img."imagemUrl" = o."fotoPrincipalUrl"
  ORDER BY img."criadoEm" ASC, img."id" ASC LIMIT 1
)
WHERE o."imagemPrincipalId" IS NULL AND o."fotoPrincipalUrl" IS NOT NULL;
