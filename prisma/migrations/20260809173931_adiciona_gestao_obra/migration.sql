-- CreateEnum
CREATE TYPE "TipoInstrucaoObra" AS ENUM ('EMBALAGEM', 'TRANSPORTE');

-- DropForeignKey
ALTER TABLE "Tecnica" DROP CONSTRAINT "Tecnica_projetoId_fkey";

-- CreateTable
CREATE TABLE "EstadoConservacao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstadoConservacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoServicoObra" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoServicoObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnaliseConservacao" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "data" DATE,
    "estadoConservacaoId" TEXT,
    "avaliador" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnaliseConservacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagemAnaliseConservacao" (
    "id" TEXT NOT NULL,
    "analiseId" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "creditos" TEXT,
    "comentarios" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImagemAnaliseConservacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestauroObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "dataEntrada" TEXT,
    "dataSaida" TEXT,
    "localRestauro" TEXT,
    "motivo" TEXT,
    "observacoes" TEXT,
    "relatorioUrl" TEXT,
    "relatorioExtensao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestauroObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicoObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "data" TEXT,
    "tipoServicoId" TEXT,
    "local" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicoObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstrucaoObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "tipo" "TipoInstrucaoObra",
    "data" TEXT,
    "profissionalResponsavel" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstrucaoObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagemInstrucaoObra" (
    "id" TEXT NOT NULL,
    "instrucaoId" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImagemInstrucaoObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimentacaoObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "data" TEXT,
    "realizadoPor" TEXT,
    "observacoes" TEXT,
    "localSaidaId" TEXT,
    "localSaidaSnapshot" TEXT,
    "localEntradaId" TEXT,
    "localEntradaSnapshot" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovimentacaoObra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EstadoConservacao_empresaId_idx" ON "EstadoConservacao"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "EstadoConservacao_empresaId_nome_key" ON "EstadoConservacao"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "TipoServicoObra_empresaId_idx" ON "TipoServicoObra"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoServicoObra_empresaId_nome_key" ON "TipoServicoObra"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "AnaliseConservacao_obraId_data_criadoEm_idx" ON "AnaliseConservacao"("obraId", "data", "criadoEm");

-- CreateIndex
CREATE INDEX "AnaliseConservacao_estadoConservacaoId_idx" ON "AnaliseConservacao"("estadoConservacaoId");

-- CreateIndex
CREATE INDEX "ImagemAnaliseConservacao_analiseId_criadoEm_idx" ON "ImagemAnaliseConservacao"("analiseId", "criadoEm");

-- CreateIndex
CREATE INDEX "RestauroObra_obraId_criadoEm_idx" ON "RestauroObra"("obraId", "criadoEm");

-- CreateIndex
CREATE INDEX "ServicoObra_obraId_criadoEm_idx" ON "ServicoObra"("obraId", "criadoEm");

-- CreateIndex
CREATE INDEX "ServicoObra_tipoServicoId_idx" ON "ServicoObra"("tipoServicoId");

-- CreateIndex
CREATE INDEX "InstrucaoObra_obraId_criadoEm_idx" ON "InstrucaoObra"("obraId", "criadoEm");

-- CreateIndex
CREATE INDEX "InstrucaoObra_tipo_idx" ON "InstrucaoObra"("tipo");

-- CreateIndex
CREATE INDEX "ImagemInstrucaoObra_instrucaoId_criadoEm_idx" ON "ImagemInstrucaoObra"("instrucaoId", "criadoEm");

-- CreateIndex
CREATE INDEX "MovimentacaoObra_obraId_criadoEm_idx" ON "MovimentacaoObra"("obraId", "criadoEm");

-- CreateIndex
CREATE INDEX "MovimentacaoObra_localSaidaId_idx" ON "MovimentacaoObra"("localSaidaId");

-- CreateIndex
CREATE INDEX "MovimentacaoObra_localEntradaId_idx" ON "MovimentacaoObra"("localEntradaId");

-- AddForeignKey
ALTER TABLE "Tecnica" ADD CONSTRAINT "Tecnica_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadoConservacao" ADD CONSTRAINT "EstadoConservacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoServicoObra" ADD CONSTRAINT "TipoServicoObra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaliseConservacao" ADD CONSTRAINT "AnaliseConservacao_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaliseConservacao" ADD CONSTRAINT "AnaliseConservacao_estadoConservacaoId_fkey" FOREIGN KEY ("estadoConservacaoId") REFERENCES "EstadoConservacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagemAnaliseConservacao" ADD CONSTRAINT "ImagemAnaliseConservacao_analiseId_fkey" FOREIGN KEY ("analiseId") REFERENCES "AnaliseConservacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestauroObra" ADD CONSTRAINT "RestauroObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoObra" ADD CONSTRAINT "ServicoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoObra" ADD CONSTRAINT "ServicoObra_tipoServicoId_fkey" FOREIGN KEY ("tipoServicoId") REFERENCES "TipoServicoObra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrucaoObra" ADD CONSTRAINT "InstrucaoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagemInstrucaoObra" ADD CONSTRAINT "ImagemInstrucaoObra_instrucaoId_fkey" FOREIGN KEY ("instrucaoId") REFERENCES "InstrucaoObra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoObra" ADD CONSTRAINT "MovimentacaoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoObra" ADD CONSTRAINT "MovimentacaoObra_localSaidaId_fkey" FOREIGN KEY ("localSaidaId") REFERENCES "Localizacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoObra" ADD CONSTRAINT "MovimentacaoObra_localEntradaId_fkey" FOREIGN KEY ("localEntradaId") REFERENCES "Localizacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
