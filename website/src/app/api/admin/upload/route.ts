import { NextResponse } from "next/server";
import path from "path";
import { requireAuth, unauthorized } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { uploadToGCS } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum ficheiro enviado" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename with date-based path
  const now = new Date();
  const dir = `uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const ext = path.extname(file.name);
  const baseName = path
    .basename(file.name, ext)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const uniqueName = `${baseName}-${Date.now()}${ext}`;
  const gcsPath = `${dir}/${uniqueName}`;

  const url = await uploadToGCS(buffer, gcsPath, file.type);

  // Save to media table
  const media = await prisma.media.create({
    data: {
      filename: file.name,
      url,
      mimeType: file.type,
      size: file.size,
    },
  });

  return NextResponse.json({ url, media });
}
