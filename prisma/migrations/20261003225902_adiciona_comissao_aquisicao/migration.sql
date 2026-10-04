-- AlterTable
ALTER TABLE "Aquisicao" ADD COLUMN     "comissao" DECIMAL(18,4),
ADD COLUMN     "tipoComissao" "TipoDesconto",
ADD COLUMN     "valorComissao" DECIMAL(18,2);
