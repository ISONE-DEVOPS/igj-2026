import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@igj.cv" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@igj.cv",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("  User: admin@igj.cv / admin123");

  // Páginas
  const pages = [
    {
      title: "Quem Somos",
      slug: "quem-somos",
      content:
        "A Inspecção-Geral de Jogos, abreviadamente IGJ, é um Serviço Central de Inspecção e Controlo da Actividade de Jogos, dotado de Autonomia Funcional, Administrativa e Financeira, directamente dependente do Ministro do Turismo, Investimentos e Desenvolvimento Empresarial.",
      published: true,
      order: 1,
    },
    {
      title: "Missão e Visão",
      slug: "missao-e-visao",
      content:
        "Desenvolvimento da actividade do jogo baseado numa fiscalização e controlo apertados de modo que essa actividade seja desenvolvida em ambiente saudável. Grande importância na contribuição e na formação do PIB.",
      published: true,
      order: 2,
    },
    {
      title: "Organograma",
      slug: "organograma",
      content: "Estrutura organizacional da IGJ.",
      published: true,
      order: 3,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log(`  ${pages.length} pages created`);

  // Zonas de Jogo
  const zones = [
    { name: "Santiago", slug: "santiago", island: "Santiago", description: "Zona permanente de jogo na ilha de Santiago", order: 1, published: true },
    { name: "São Vicente", slug: "sao-vicente", island: "São Vicente", description: "Zona permanente de jogo na ilha de São Vicente", order: 2, published: true },
    { name: "Sal", slug: "sal", island: "Sal", description: "Zona permanente de jogo na ilha do Sal", order: 3, published: true },
    { name: "Maio", slug: "maio", island: "Maio", description: "Zona permanente de jogo na ilha do Maio", order: 4, published: true },
    { name: "Boavista", slug: "boavista", island: "Boavista", description: "Zona permanente de jogo na ilha da Boavista", order: 5, published: true },
  ];

  for (const zone of zones) {
    await prisma.gamingZone.upsert({
      where: { slug: zone.slug },
      update: {},
      create: zone,
    });
  }
  console.log(`  ${zones.length} gaming zones created`);

  // Slides
  await prisma.slide.upsert({
    where: { id: "slide-1" },
    update: {},
    create: {
      id: "slide-1",
      title: "Inspecção-Geral de Jogos",
      subtitle: "Entidade Reguladora de Jogos e Apostas de Cabo Verde",
      image: "",
      active: true,
      order: 1,
    },
  });
  console.log("  1 slide created");

  // Settings
  const settings = [
    { key: "site_name", value: "IGJ - Inspecção-Geral de Jogos", label: "Nome do Site" },
    { key: "site_description", value: "Entidade Reguladora de Jogos e Apostas de Cabo Verde", label: "Descrição" },
    { key: "phone", value: "(+238) 260 48 43/34", label: "Telefone" },
    { key: "email", value: "info@igj.cv", label: "Email" },
    { key: "address", value: "Praia, Cabo Verde", label: "Morada" },
    { key: "hours", value: "Segunda - Sexta: 8:00 - 17:00", label: "Horário" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`  ${settings.length} settings created`);

  // News categories
  const categories = [
    { name: "Comunicado", slug: "comunicado" },
    { name: "Evento", slug: "evento" },
    { name: "Regulação", slug: "regulacao" },
    { name: "Internacional", slug: "internacional" },
  ];

  for (const cat of categories) {
    await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`  ${categories.length} news categories created`);

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
