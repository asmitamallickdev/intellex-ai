import React from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SkillsPage from "@/components/skills/skills-page";

export default function Page() {
  return (
    <DashboardLayout>
      <SkillsPage />
    </DashboardLayout>
  );
}
