export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          仪表盘
        </h1>
        <p className="text-sm text-neutral-500 mt-1">博客数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={stat.colorClass}>{stat.trend}</span>
            </div>
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 占位 - 后续可以放最近文章列表 */}
      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 bg-white dark:bg-neutral-900">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          最近动态
        </h2>
        {/* TODO: 显示最近文章或操作日志 */}
        <p className="text-sm text-neutral-400 text-center py-8">
          暂无动态
        </p>
      </div>
    </div>
  );
}

const stats = [
  { label: "文章总数", value: "0", icon: "📝", trend: "+", colorClass: "text-xs text-emerald-500" },
  { label: "分类数", value: "0", icon: "📁", trend: "-", colorClass: "text-xs text-neutral-400" },
  { label: "已发布", value: "0", icon: "✅", trend: "-", colorClass: "text-xs text-neutral-400" },
];
