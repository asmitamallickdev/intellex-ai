import React from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import KnowledgePage from "@/components/knowledge/knowledge-page";

export default function Page() {
  return (
    <DashboardLayout>
      <KnowledgePage />
    </DashboardLayout>
  );
}
