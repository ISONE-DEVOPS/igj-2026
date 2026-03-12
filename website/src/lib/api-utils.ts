import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}

export function notFound(message = "Não encontrado") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message = "Dados inválidos") {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function success(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}
