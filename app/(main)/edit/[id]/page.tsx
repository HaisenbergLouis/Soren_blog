import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPostForm from "./EditPostForm";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) redirect("/profile");
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/profile");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          编辑文章
        </h1>
        <p className="text-sm text-neutral-500 mt-1">修改文章内容</p>
      </div>

      <EditPostForm post={post} />
    </div>
  );
}
