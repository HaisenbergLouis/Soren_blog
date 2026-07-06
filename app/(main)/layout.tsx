import Link from "next/link";
import { Home, FileText, Settings } from "lucide-react";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/layout/LogoutButton";

const navLinks = [
  { label: "首页", href: "/", icon: Home },
  { label: "文章", href: "/posts", icon: FileText },
  { label: "管理后台", href: "/admin", icon: Settings },
];

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
            <nav className="flex items-center gap-1">
              {navLinks
                .filter((link) => {
                  if (link.href === "/admin") return session?.user?.role === "ADMIN";
                  return true;
                })
                .map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  {session.user.name ?? session.user.email}
                </Link>
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

      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} FS Blog. Built with Next.js.</p>
        </div>
      </footer>
    </>
  );
}
