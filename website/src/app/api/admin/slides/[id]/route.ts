import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, notFound } from "@/lib/api-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const slide = await prisma.slide.findUnique({ where: { id } });
  if (!slide) return notFound();
  return success(slide);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();

  const slide = await prisma.slide.update({
    where: { id },
    data: {
      title: body.title,
      subtitle: body.subtitle || null,
      image: body.image,
      link: body.link || null,
      active: body.active,
      order: body.order || 0,
    },
  });

  return success(slide);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.slide.delete({ where: { id } });
  return success({ deleted: true });
}
