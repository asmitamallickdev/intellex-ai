import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ChatPage from "@/components/chats/chat-page";
import { getSkillAction } from "@/src/actions/skill.actions";
import { getChatAction } from "@/src/actions/chat.actions";

export default async function Page({
  params,
}: {
  params: Promise<{ skillId: string; chatId: string }>
}) {
  const { skillId, chatId } = await params;

  const [skillRes, chatRes] = await Promise.all([
    getSkillAction(skillId),
    getChatAction(chatId),
  ]);

  if (!skillRes.success || !chatRes.success) {
    notFound();
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8 text-gray-600 dark:text-gray-500 dark:text-gray-400 font-medium">Loading workspace discussion...</div>}>
        <ChatPage skillId={skillId} chatId={chatId} />
      </Suspense>
    </DashboardLayout>
  );
}
