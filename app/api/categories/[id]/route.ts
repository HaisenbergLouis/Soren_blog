import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await prisma.category.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
