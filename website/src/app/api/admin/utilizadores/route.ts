import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, forbidden, success, badRequest } from "@/lib/api-utils";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  return success(users);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const body = await req.json();

  if (!body.name || !body.email || !body.password) {
    return badRequest("Nome, email e password são obrigatórios");
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return badRequest("Já existe um utilizador com este email");
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role || "EDITOR",
      active: body.active ?? true,
    },
  });

  return success({ id: user.id, name: user.name, email: user.email, role: user.role }, 201);
}
