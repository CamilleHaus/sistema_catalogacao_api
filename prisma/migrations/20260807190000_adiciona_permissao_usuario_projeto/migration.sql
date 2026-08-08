-- CreateEnum
CREATE TYPE "PermissaoProjeto" AS ENUM ('VISUALIZAR', 'EDITAR');

-- AlterTable
ALTER TABLE "UsuarioProjeto"
ADD COLUMN "permissao" "PermissaoProjeto" NOT NULL DEFAULT 'VISUALIZAR';
