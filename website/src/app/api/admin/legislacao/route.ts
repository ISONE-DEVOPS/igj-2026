import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const legislation = await prisma.legislation.findMany({ orderBy: { publishDate: "desc" } });
  return success(legislation);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();
  if (!body.title || !body.slug) return badRequest("Título e slug são obrigatórios");

  const legislation = await prisma.legislation.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      fileUrl: body.fileUrl || null,
      type: body.type || "OUTRO",
      number: body.number || null,
      publishDate: body.publishDate ? new Date(body.publishDate) : null,
      published: body.published || false,
    },
  });

  return success(legislation, 201);
}
