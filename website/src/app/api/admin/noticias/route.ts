import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return success(news);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();

  if (!body.title || !body.slug) {
    return badRequest("Título e slug são obrigatórios");
  }

  const news = await prisma.news.create({
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content || "",
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      published: body.published || false,
      featured: body.featured || false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      categoryId: body.categoryId || null,
    },
  });

  return success(news, 201);
}
