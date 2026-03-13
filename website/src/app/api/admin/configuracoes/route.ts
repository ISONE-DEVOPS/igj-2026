import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - list all settings
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(settings);
}

// PUT - update settings (receives array of { id, value })
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await request.json();
  const updates = body.settings as { id: string; value: string }[];

  await Promise.all(
    updates.map((s) =>
      prisma.siteSetting.update({ where: { id: s.id }, data: { value: s.value } })
    )
  );

  return NextResponse.json({ ok: true });
}

// POST - create a new setting
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await request.json();

  if (!body.key?.trim()) {
    return NextResponse.json({ error: "A chave é obrigatória" }, { status: 400 });
  }

  const existing = await prisma.siteSetting.findUnique({ where: { key: body.key } });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma configuração com esta chave" }, { status: 400 });
  }

  const setting = await prisma.siteSetting.create({
    data: { key: body.key.trim(), value: body.value || "", label: body.label || "" },
  });

  return NextResponse.json(setting, { status: 201 });
}
