import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  return success(galleries);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();
  if (!body.title || !body.slug) return badRequest("Título e slug são obrigatórios");

  const gallery = await prisma.gallery.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      coverImage: body.coverImage || null,
      published: body.published || false,
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

  return success(gallery, 201);
}
