export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          新建分类
        </h1>
        <p className="text-sm text-neutral-500 mt-1">添加一个新的文章分类</p>
      </div>

      {/* TODO: 分类表单 - 名称、标识(slug)、描述 */}
      <div className="max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-4xl mb-4">🏷️</span>
          <p className="text-sm text-neutral-400">
            表单区域 — 等你来写业务逻辑
          </p>
        </div>
      </div>
    </div>
  );
}
