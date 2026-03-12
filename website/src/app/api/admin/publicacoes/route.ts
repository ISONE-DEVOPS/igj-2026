import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const publications = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });
  return success(publications);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();
  if (!body.title || !body.slug) return badRequest("Título e slug são obrigatórios");

  const publication = await prisma.publication.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      coverImage: body.coverImage || null,
      fileUrl: body.fileUrl || null,
      type: body.type || "OUTRO",
      published: body.published || false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
    },
  });

  return success(publication, 201);
}
