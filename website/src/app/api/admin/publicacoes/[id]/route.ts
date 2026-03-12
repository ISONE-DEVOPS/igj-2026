import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, notFound } from "@/lib/api-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const item = await prisma.publication.findUnique({ where: { id } });
  if (!item) return notFound();
  return success(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();

  const item = await prisma.publication.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      coverImage: body.coverImage || null,
      fileUrl: body.fileUrl || null,
      type: body.type,
      published: body.published,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
    },
  });

  return success(item);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.publication.delete({ where: { id } });
  return success({ deleted: true });
}
