// Server Component — 登录校验 + 跳转客户端组件
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ConversationList from "./ConversationList";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">私信</h1>
      <ConversationList />
    </div>
  );
}
