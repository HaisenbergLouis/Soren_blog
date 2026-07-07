import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import WritePostForm from "./WritePostForm";

export default async function WritePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          写文章
        </h1>
        <p className="text-sm text-neutral-500 mt-1">撰写一篇新的博客文章</p>
      </div>

      <WritePostForm />
    </div>
  );
}
