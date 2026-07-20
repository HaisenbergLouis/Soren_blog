import ChatDetail from "../ChatDetail";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex">
      <ChatDetail conversationId={conversationId} />
    </div>
  );
}
