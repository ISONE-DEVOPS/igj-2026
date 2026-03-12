import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
  return success(slides);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();
  if (!body.title || !body.image) return badRequest("Título e imagem são obrigatórios");

  const slide = await prisma.slide.create({
    data: {
      title: body.title,
      subtitle: body.subtitle || null,
      image: body.image,
      link: body.link || null,
      active: body.active ?? true,
      order: body.order || 0,
    },
  });

  return success(slide, 201);
}
