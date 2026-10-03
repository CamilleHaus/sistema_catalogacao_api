-- AlterTable
ALTER TABLE "Obra" ADD COLUMN     "fichaMaeId" TEXT;

-- CreateTable
CREATE TABLE "FichaMae" (
    "id" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "altura" DECIMAL(12,3),
    "largura" DECIMAL(12,3),
    "profundidade" DECIMAL(12,3),
    "unidade" "UnidadeMedida",
    "descricaoVariavel" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FichaMae_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FichaMae_projetoId_idx" ON "FichaMae"("projetoId");

-- CreateIndex
CREATE INDEX "Obra_fichaMaeId_idx" ON "Obra"("fichaMaeId");

-- AddForeignKey
ALTER TABLE "Obra" ADD CONSTRAINT "Obra_fichaMaeId_fkey" FOREIGN KEY ("fichaMaeId") REFERENCES "FichaMae"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaMae" ADD CONSTRAINT "FichaMae_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
