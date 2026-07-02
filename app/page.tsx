import Link from "next/link";
import { PenLine, FolderOpen, Palette } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero 区域 */}
      <section className="text-center py-20 md:py-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          全栈博客项目
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
          记录思考
          <br />
          <span className="text-neutral-400">分享知识</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          一个使用 Next.js、TypeScript 和 Tailwind CSS 构建的全栈博客平台
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/posts"
            className="rounded-xl bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-neutral-900/20 transition-all hover:bg-neutral-800 hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
          >
            浏览文章
          </Link>
          <Link
            href="/admin"
            className="rounded-xl border border-neutral-300 px-8 py-3.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:-translate-y-0.5 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            管理后台 →
          </Link>
        </div>
      </section>

      {/* 特性区域 */}
      <section className="grid gap-6 md:grid-cols-3 pb-20">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div className="mb-4 text-3xl">
              <feature.icon className="h-8 w-8 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

const features = [
  {
    icon: PenLine,
    title: "Markdown 写作",
    description: "使用 Markdown 语法编写文章，支持代码高亮和丰富的排版样式",
  },
  {
    icon: FolderOpen,
    title: "分类管理",
    description: "灵活的分类和标签系统，让文章组织更加清晰有序，方便检索",
  },
  {
    icon: Palette,
    title: "响应式设计",
    description: "精美的深色/浅色主题，完美适配桌面端和移动端设备",
  },
];
