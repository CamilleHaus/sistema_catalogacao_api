-- CreateEnum
CREATE TYPE "Moeda" AS ENUM ('BRL', 'USD', 'EUR', 'GBP');

-- CreateEnum
CREATE TYPE "TipoDesconto" AS ENUM ('VALOR_FIXO', 'PERCENTUAL');

-- CreateTable
CREATE TABLE "FormaNegociacao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormaNegociacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModalidadeSeguro" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModalidadeSeguro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aquisicao" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "formaNegociacaoId" TEXT,
    "data" TEXT,
    "adquiridoDe" TEXT,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "tipoDesconto" "TipoDesconto",
    "desconto" DECIMAL(18,4),
    "valorFinal" DECIMAL(18,2),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aquisicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotaFiscalAquisicao" (
    "id" TEXT NOT NULL,
    "aquisicaoId" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "numero" TEXT,
    "data" DATE,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "comentarios" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotaFiscalAquisicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprovantePagamento" (
    "id" TEXT NOT NULL,
    "aquisicaoId" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "data" DATE,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "comentarios" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComprovantePagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "formaNegociacaoId" TEXT,
    "data" TEXT,
    "vendidoPara" TEXT,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "tipoDesconto" "TipoDesconto",
    "desconto" DECIMAL(18,4),
    "valorFinal" DECIMAL(18,2),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprovanteVenda" (
    "id" TEXT NOT NULL,
    "vendaId" TEXT NOT NULL,
    "imagemUrl" TEXT,
    "data" DATE,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "comentarios" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComprovanteVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvaliacaoFinanceira" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "data" DATE,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "avaliador" TEXT,
    "comentarios" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvaliacaoFinanceira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguroObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "vigencia" TEXT,
    "moeda" "Moeda",
    "valor" DECIMAL(18,2),
    "modalidadeSeguroId" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeguroObra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormaNegociacao_empresaId_idx" ON "FormaNegociacao"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "FormaNegociacao_empresaId_nome_key" ON "FormaNegociacao"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "ModalidadeSeguro_empresaId_idx" ON "ModalidadeSeguro"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "ModalidadeSeguro_empresaId_nome_key" ON "ModalidadeSeguro"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Aquisicao_obraId_key" ON "Aquisicao"("obraId");

-- CreateIndex
CREATE INDEX "Aquisicao_formaNegociacaoId_idx" ON "Aquisicao"("formaNegociacaoId");

-- CreateIndex
CREATE INDEX "NotaFiscalAquisicao_aquisicaoId_criadoEm_idx" ON "NotaFiscalAquisicao"("aquisicaoId", "criadoEm");

-- CreateIndex
CREATE INDEX "ComprovantePagamento_aquisicaoId_criadoEm_idx" ON "ComprovantePagamento"("aquisicaoId", "criadoEm");

-- CreateIndex
CREATE UNIQUE INDEX "Venda_obraId_key" ON "Venda"("obraId");

-- CreateIndex
CREATE INDEX "Venda_formaNegociacaoId_idx" ON "Venda"("formaNegociacaoId");

-- CreateIndex
CREATE INDEX "ComprovanteVenda_vendaId_criadoEm_idx" ON "ComprovanteVenda"("vendaId", "criadoEm");

-- CreateIndex
CREATE INDEX "AvaliacaoFinanceira_obraId_data_criadoEm_idx" ON "AvaliacaoFinanceira"("obraId", "data", "criadoEm");

-- CreateIndex
CREATE INDEX "SeguroObra_obraId_criadoEm_idx" ON "SeguroObra"("obraId", "criadoEm");

-- CreateIndex
CREATE INDEX "SeguroObra_modalidadeSeguroId_idx" ON "SeguroObra"("modalidadeSeguroId");

-- AddForeignKey
ALTER TABLE "FormaNegociacao" ADD CONSTRAINT "FormaNegociacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModalidadeSeguro" ADD CONSTRAINT "ModalidadeSeguro_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisicao" ADD CONSTRAINT "Aquisicao_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisicao" ADD CONSTRAINT "Aquisicao_formaNegociacaoId_fkey" FOREIGN KEY ("formaNegociacaoId") REFERENCES "FormaNegociacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaFiscalAquisicao" ADD CONSTRAINT "NotaFiscalAquisicao_aquisicaoId_fkey" FOREIGN KEY ("aquisicaoId") REFERENCES "Aquisicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprovantePagamento" ADD CONSTRAINT "ComprovantePagamento_aquisicaoId_fkey" FOREIGN KEY ("aquisicaoId") REFERENCES "Aquisicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_formaNegociacaoId_fkey" FOREIGN KEY ("formaNegociacaoId") REFERENCES "FormaNegociacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprovanteVenda" ADD CONSTRAINT "ComprovanteVenda_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvaliacaoFinanceira" ADD CONSTRAINT "AvaliacaoFinanceira_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroObra" ADD CONSTRAINT "SeguroObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroObra" ADD CONSTRAINT "SeguroObra_modalidadeSeguroId_fkey" FOREIGN KEY ("modalidadeSeguroId") REFERENCES "ModalidadeSeguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
