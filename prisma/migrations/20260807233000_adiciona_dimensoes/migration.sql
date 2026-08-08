CREATE TYPE "TipoDimensao" AS ENUM ('SEM_MOLDURA', 'COM_MOLDURA');
CREATE TYPE "UnidadeMedida" AS ENUM ('CM', 'IN');

CREATE TABLE "DimensaoObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "tipo" "TipoDimensao" NOT NULL,
    "altura" DECIMAL(12,3),
    "largura" DECIMAL(12,3),
    "profundidade" DECIMAL(12,3),
    "unidade" "UnidadeMedida",
    "descricaoVariavel" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DimensaoObra_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DimensaoObra_formato_check" CHECK (
      (
        "altura" IS NOT NULL AND "altura" > 0 AND
        "largura" IS NOT NULL AND "largura" > 0 AND
        ("profundidade" IS NULL OR "profundidade" > 0) AND
        "unidade" IS NOT NULL AND "descricaoVariavel" IS NULL
      ) OR (
        "altura" IS NULL AND "largura" IS NULL AND
        "profundidade" IS NULL AND "unidade" IS NULL AND
        "descricaoVariavel" IS NOT NULL AND length(trim("descricaoVariavel")) > 0
      )
    )
);

CREATE UNIQUE INDEX "DimensaoObra_obraId_tipo_key" ON "DimensaoObra"("obraId", "tipo");
CREATE INDEX "DimensaoObra_obraId_idx" ON "DimensaoObra"("obraId");
ALTER TABLE "DimensaoObra" ADD CONSTRAINT "DimensaoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
