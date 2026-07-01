import React from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import UploadPage from "@/components/upload/upload-page";

export default function Page() {
  return (
    <DashboardLayout>
      <UploadPage />
    </DashboardLayout>
  );
}
