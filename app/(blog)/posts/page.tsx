import { BookOpen } from "lucide-react";

export default function PostsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          所有文章
        </h1>
        <p className="text-neutral-500 mt-2">探索所有博客文章</p>
      </div>

      {/* TODO: 文章列表 - 调用 API 获取文章数据并渲染 PostCard */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 文章卡片将在这里渲染 */}
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">
            <BookOpen className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          </span>
          <p className="text-neutral-400">还没有文章</p>
        </div>
      </div>
    </div>
  );
}
