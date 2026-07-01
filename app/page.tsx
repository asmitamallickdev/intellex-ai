import React from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import WelcomeCard from "@/components/dashboard/welcome-card";
import QuickActionCard from "@/components/dashboard/quick-action-card";
import StatsCard from "@/components/dashboard/stats-card";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import KnowledgeGraphCard from "@/components/dashboard/knowledge-graph-card";
import { statsData } from "@/lib/mock-data";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
      {/* 1. Welcome Card Hero */}
      <WelcomeCard />

      {/* 2. Quick Action Cards (Three columns) */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-bold text-gray-600 dark:text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/skills?create=true" className="block cursor-pointer">
            <QuickActionCard
              title="Create Skill"
              subtitle="Configure a new capability"
              iconName="Cpu"
            />
          </Link>
          <Link href="/upload" className="block cursor-pointer">
            <QuickActionCard
              title="Upload Files"
              subtitle="Index PDFs, Docs, Excel files"
              iconName="Upload"
            />
          </Link>
          <Link href="/skills" className="block cursor-pointer">
            <QuickActionCard
              title="New Chat"
              subtitle="Start AI discussion session"
              iconName="MessageSquare"
            />
          </Link>
        </div>
      </section>

      {/* 3. Statistics Section (Five columns) */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-bold text-gray-600 dark:text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
          Platform Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statsData.map((stat) => (
            <StatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendType={stat.trendType}
              iconName={stat.iconName}
            />
          ))}
        </div>
      </section>

      {/* 4. Main content section: Left (70%) Recent Activity, Right (30%) Knowledge Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <RecentActivityCard />
        </div>
        <div className="lg:col-span-3">
          <KnowledgeGraphCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
