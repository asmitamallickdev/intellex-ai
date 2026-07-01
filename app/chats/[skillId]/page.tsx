import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ChatPage from "@/components/chats/chat-page";
import { getSkillAction } from "@/src/actions/skill.actions";

export default async function Page({
  params,
}: {
  params: Promise<{ skillId: string }>
}) {
  const { skillId } = await params;

  const res = await getSkillAction(skillId);
  if (!res.success) {
    notFound();
  }

  return (
    <DashboardLayout>
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8 text-zinc-500 font-medium">Loading workspace discussion...</div>}>
        <ChatPage skillId={skillId} />
      </Suspense>
    </DashboardLayout>
  );
}
