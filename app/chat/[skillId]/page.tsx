import { redirect } from "next/navigation";
import { ChatService } from "@/src/services/chat.service";

export default async function Page({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { skillId } = await params;

  try {
    const chat = await ChatService.createChat(skillId, "New Chat");
    if (chat) {
      redirect(`/chat/${skillId}/${chat.id}`);
    }
  } catch (err) {
    if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[Chat] Failed to create chat:", err);
  }

  redirect("/skills");
}
