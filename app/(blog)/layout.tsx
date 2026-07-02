export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {children}
    </div>
  );
}
