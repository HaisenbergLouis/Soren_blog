import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const posts = await p.post.findMany({
  select: { id: true, title: true, slug: true, published: true },
});
for (const x of posts) {
  console.log(x.title, "|", x.slug, "|", x.published ? "已发布" : "草稿");
}
await p.$disconnect();
