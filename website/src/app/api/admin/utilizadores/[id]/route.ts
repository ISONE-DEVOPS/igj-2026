import { prisma } from "@/lib/prisma";
import { requireAdmin, forbidden, success, notFound, badRequest } from "@/lib/api-utils";
import bcrypt from "bcryptjs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  if (!user) return notFound();

  return success(user);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const { id } = await params;
  const body = await req.json();

  if (!body.name || !body.email) {
    return badRequest("Nome e email são obrigatórios");
  }

  // Check email uniqueness (exclude current user)
  const existing = await prisma.user.findFirst({
    where: { email: body.email, id: { not: id } },
  });
  if (existing) {
    return badRequest("Já existe um utilizador com este email");
  }

  const data: Record<string, unknown> = {
    name: body.name,
    email: body.email,
    role: body.role || "EDITOR",
    active: body.active ?? true,
  };

  // Only update password if provided
  if (body.password) {
    data.password = await bcrypt.hash(body.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return success({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const { id } = await params;
  await prisma.user.delete({ where: { id } });

  return success({ deleted: true });
}
