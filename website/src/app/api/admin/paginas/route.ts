import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const pages = await prisma.page.findMany({ orderBy: { order: "asc" } });
  return success(pages);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();
  if (!body.title || !body.slug) return badRequest("Título e slug são obrigatórios");

  const page = await prisma.page.create({
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content || "",
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      published: body.published || false,
      order: body.order || 0,
      parentId: body.parentId || null,
    },
  });

  return success(page, 201);
}
