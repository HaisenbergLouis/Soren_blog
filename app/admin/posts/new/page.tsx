import { FileEdit } from "lucide-react";

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          新建文章
        </h1>
        <p className="text-sm text-neutral-500 mt-1">撰写一篇新博客文章</p>
      </div>

      {/* TODO: 文章表单 - 标题、slug、摘要、内容(Markdown)、封面图、分类、标签、发布状态 */}
      <div className="max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-4">
            <FileEdit />
          </span>
          <p className="text-sm text-neutral-400">
            表单区域 — 等你来写业务逻辑
          </p>
        </div>
      </div>
    </div>
  );
}
