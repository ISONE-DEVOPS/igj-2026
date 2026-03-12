import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, notFound } from "@/lib/api-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!gallery) return notFound();
  return success(gallery);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();

  // Delete existing photos and recreate
  await prisma.galleryPhoto.deleteMany({ where: { galleryId: id } });

  const gallery = await prisma.gallery.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      coverImage: body.coverImage || null,
      published: body.published,
      photos: body.photos?.length
        ? {
            create: body.photos.map((p: { url: string; caption?: string }, i: number) => ({
              url: p.url,
              caption: p.caption || null,
              order: i,
            })),
          }
        : undefined,
    },
    include: { photos: true },
  });

  return success(gallery);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.gallery.delete({ where: { id } });
  return success({ deleted: true });
}
