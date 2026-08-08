-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('ADMIN_GLOBAL', 'ADMIN_EMPRESA', 'USUARIO');

-- CreateEnum
CREATE TYPE "StatusProjeto" AS ENUM ('ATIVO', 'ARQUIVADO');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "PapelUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "deveAlterarSenha" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "status" "StatusProjeto" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioProjeto" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioProjeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "revogadoEm" TIMESTAMP(3),

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nome_key" ON "Empresa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- CreateIndex
CREATE INDEX "Usuario_papel_idx" ON "Usuario"("papel");

-- CreateIndex
CREATE INDEX "Projeto_empresaId_status_idx" ON "Projeto"("empresaId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Projeto_empresaId_nome_key" ON "Projeto"("empresaId", "nome");

-- CreateIndex
CREATE INDEX "UsuarioProjeto_projetoId_idx" ON "UsuarioProjeto"("projetoId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioProjeto_usuarioId_projetoId_key" ON "UsuarioProjeto"("usuarioId", "projetoId");

-- CreateIndex
CREATE INDEX "Sessao_usuarioId_idx" ON "Sessao"("usuarioId");

-- CreateIndex
CREATE INDEX "Sessao_expiraEm_idx" ON "Sessao"("expiraEm");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioProjeto" ADD CONSTRAINT "UsuarioProjeto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioProjeto" ADD CONSTRAINT "UsuarioProjeto_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
