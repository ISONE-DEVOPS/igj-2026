import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, notFound } from "@/lib/api-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id }, include: { category: true } });
  if (!news) return notFound();

  return success(news);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json();

  const news = await prisma.news.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      published: body.published,
      featured: body.featured,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      categoryId: body.categoryId || null,
    },
  });

  return success(news);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.news.delete({ where: { id } });

  return success({ deleted: true });
}
