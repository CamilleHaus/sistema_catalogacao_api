-- AlterTable: fichas já cadastradas recebem um código provisório antes de o campo virar obrigatório.
ALTER TABLE "FichaMae" ADD COLUMN "codigo" TEXT;
UPDATE "FichaMae" SET "codigo" = 'FM-' || left("id", 8) WHERE "codigo" IS NULL;
ALTER TABLE "FichaMae" ALTER COLUMN "codigo" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FichaMae_projetoId_codigo_key" ON "FichaMae"("projetoId", "codigo");
