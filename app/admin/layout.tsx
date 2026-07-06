import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, FileText, FolderTree, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";

const adminNav = [
  { label: "仪表盘", href: "/admin", icon: LayoutDashboard },
  { label: "文章管理", href: "/admin/posts", icon: FileText },
  { label: "分类管理", href: "/admin/categories", icon: FolderTree },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-neutral-950 text-white p-6 flex flex-col border-r border-neutral-800">
        <div className="mb-8">
          <Link href="/" className="text-lg font-bold tracking-tight">
            FS Blog
          </Link>
          <p className="text-xs text-neutral-500 mt-1">管理后台</p>
        </div>
        <nav className="flex flex-col gap-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 底部返回前台 */}
        <div className="mt-auto pt-6 border-t border-neutral-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-neutral-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回前台
          </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
