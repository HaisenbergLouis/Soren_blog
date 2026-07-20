import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MessagesPage from "./MessagesPage";

export default async function MessagesRoute() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex">
      <MessagesPage />
    </div>
  );
}
