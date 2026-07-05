import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany();
  return Response.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
    },
  });

  return Response.json(category, { status: 201 });
}
