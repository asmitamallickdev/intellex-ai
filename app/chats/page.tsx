import React, { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ChatPage from "@/components/chats/chat-page";

export default function Page() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8 text-zinc-500 font-medium">Loading workspace discussion...</div>}>
        <ChatPage />
      </Suspense>
    </DashboardLayout>
  );
}
