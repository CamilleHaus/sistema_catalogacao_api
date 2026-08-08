import 'dotenv/config';
import { PapelUsuario, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function bootstrapAdminGlobal() {
  const nome = process.env.ADMIN_GLOBAL_NAME?.trim();
  const email = process.env.ADMIN_GLOBAL_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_GLOBAL_PASSWORD;

  if (!nome || !email || !senha || senha.length < 8) {
    throw new Error(
      'Defina ADMIN_GLOBAL_NAME, ADMIN_GLOBAL_EMAIL e ADMIN_GLOBAL_PASSWORD (mínimo de 8 caracteres).',
    );
  }

  const existingAdmins = await prisma.usuario.findMany({
    where: { papel: PapelUsuario.ADMIN_GLOBAL },
    select: { id: true, email: true },
  });

  if (existingAdmins.length > 1) {
    throw new Error(
      'Há mais de um ADMIN_GLOBAL cadastrado. Corrija os dados antes de continuar.',
    );
  }

  if (existingAdmins.length === 1) {
    console.info(`ADMIN_GLOBAL já cadastrado: ${existingAdmins[0].email}`);
    return;
  }

  await prisma.usuario.create({
    data: {
      empresaId: null,
      nome,
      email,
      senhaHash: await argon2.hash(senha, { type: argon2.argon2id }),
      papel: PapelUsuario.ADMIN_GLOBAL,
      ativo: true,
      deveAlterarSenha: false,
    },
  });

  console.info(`ADMIN_GLOBAL criado: ${email}`);
}

bootstrapAdminGlobal()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
