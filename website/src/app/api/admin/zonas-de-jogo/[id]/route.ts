import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, notFound } from "@/lib/api-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const zone = await prisma.gamingZone.findUnique({ where: { id } });
  if (!zone) return notFound();
  return success(zone);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();

  const zone = await prisma.gamingZone.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      island: body.island,
      description: body.description || null,
      address: body.address || null,
      image: body.image || null,
      published: body.published,
      order: body.order || 0,
    },
  });

  return success(zone);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.gamingZone.delete({ where: { id } });
  return success({ deleted: true });
}
