import type { Prisma, Category } from "@prisma/client";

// 文章列表项（带分类和标签）
export type PostListItem = Prisma.PostGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    tags: { include: { tag: { select: { name: true; slug: true } } } };
  };
}>;

// 文章管理列表项
export type PostAdminItem = Prisma.PostGetPayload<{
  include: { category: { select: { name: true } } };
}>;

// export type { Category } from "@prisma/client";
export type CategoryData = Category;
