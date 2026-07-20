/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Home, Settings, Search, PenSquare } from "lucide-react";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/layout/LogoutButton";
import Footer from "@/components/layout/Footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              FS Blog
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <Home className="h-4 w-4" />
              首页
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* 搜索框 */}
            <form action="/" method="GET" className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="q"
                  placeholder="搜索文章..."
                  className="w-40 lg:w-56 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-9 pr-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>
            </form>

            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden border-2 border-transparent hover:border-neutral-400 transition-all shrink-0"
                  title={session.user.name ?? session.user.email ?? ""}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="头像"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {(session.user.name ?? "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </Link>
                <Link
                  href="/write"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                >
                  <PenSquare className="h-4 w-4" />
                  写文章
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  >
                    <Settings className="h-4 w-4" />
                    管理后台
                  </Link>
                )}
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}
