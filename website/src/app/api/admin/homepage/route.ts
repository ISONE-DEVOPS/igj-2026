import { prisma } from "@/lib/prisma";
import { requireAdmin, forbidden, success, badRequest } from "@/lib/api-utils";

const HOMEPAGE_KEY = "homepage_content";

const defaultContent = {
  pilares: {
    subtitle: "Os Nossos Pilares",
    title: "Valores que nos Orientam",
    items: [
      { title: "Credibilidade", description: "Actuação transparente e responsável na regulação do sector de jogos" },
      { title: "Transparência", description: "Processos claros e informação acessível a todos os cidadãos" },
      { title: "Confiança", description: "Relação de confiança com operadores e público em geral" },
      { title: "Tranquilidade", description: "Ambiente saudável para o desenvolvimento da actividade do jogo" },
    ],
  },
  sobre: {
    subtitle: "Sobre Nós",
    title: "Quem Somos",
    text1: "A Inspecção-Geral de Jogos, abreviadamente IGJ, é um Serviço Central de Inspecção e Controlo da Actividade de Jogos, dotado de Autonomia Funcional, Administrativa e Financeira, directamente dependente do Ministro do Turismo, Investimentos e Desenvolvimento Empresarial.",
    text2: "A nossa visão é o desenvolvimento da actividade do jogo baseado numa fiscalização e controlo apertados de modo que essa actividade seja desenvolvida em ambiente saudável, com grande importância na contribuição e na formação do PIB.",
    stats: [
      { label: "Ilhas com Zonas de Jogo", value: "5" },
      { label: "Anos de Regulação", value: "20+" },
      { label: "Casinos Regulados", value: "3+" },
      { label: "Legislação Vigente", value: "auto" },
    ],
  },
  cta: {
    title: "Consulte a Legislação",
    text: "Aceda ao enquadramento legal da actividade de jogos em Cabo Verde. Toda a legislação disponível para consulta.",
  },
};

export async function GET() {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const setting = await prisma.siteSetting.findUnique({ where: { key: HOMEPAGE_KEY } });

  if (!setting) {
    return success(defaultContent);
  }

  try {
    const content = JSON.parse(setting.value);
    return success({ ...defaultContent, ...content });
  } catch {
    return success(defaultContent);
  }
}

export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) return forbidden();

  const body = await req.json();
  if (!body) return badRequest("Dados inválidos");

  const value = JSON.stringify(body);

  await prisma.siteSetting.upsert({
    where: { key: HOMEPAGE_KEY },
    update: { value },
    create: { key: HOMEPAGE_KEY, value, label: "Conteúdo da Homepage" },
  });

  return success({ ok: true });
}
