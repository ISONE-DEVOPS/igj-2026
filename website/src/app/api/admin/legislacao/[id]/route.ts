import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, notFound } from "@/lib/api-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const item = await prisma.legislation.findUnique({ where: { id } });
  if (!item) return notFound();
  return success(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();

  const item = await prisma.legislation.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      fileUrl: body.fileUrl || null,
      type: body.type,
      number: body.number || null,
      publishDate: body.publishDate ? new Date(body.publishDate) : null,
      published: body.published,
    },
  });

  return success(item);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.legislation.delete({ where: { id } });
  return success({ deleted: true });
}
