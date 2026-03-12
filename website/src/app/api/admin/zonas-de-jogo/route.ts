import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized, success, badRequest } from "@/lib/api-utils";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const zones = await prisma.gamingZone.findMany({ orderBy: { order: "asc" } });
  return success(zones);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await req.json();
  if (!body.name || !body.slug) return badRequest("Nome e slug são obrigatórios");

  const zone = await prisma.gamingZone.create({
    data: {
      name: body.name,
      slug: body.slug,
      island: body.island || "",
      description: body.description || null,
      address: body.address || null,
      image: body.image || null,
      published: body.published || false,
      order: body.order || 0,
    },
  });

  return success(zone, 201);
}
