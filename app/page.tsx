"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import WelcomeCard from "@/components/dashboard/welcome-card";
import QuickActionCard from "@/components/dashboard/quick-action-card";
import StatsCard from "@/components/dashboard/stats-card";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import KnowledgeGraphCard from "@/components/dashboard/knowledge-graph-card";
import Link from "next/link";
import { getAllSkillsAction } from "@/src/actions/skill.actions";
import { getAllFilesAction } from "@/src/actions/upload.actions";
import { getChatsCountAction } from "@/src/actions/chat.actions";
import { getMemoriesCountAction } from "@/src/actions/memory.actions";

export default function Home() {
  const [stats, setStats] = useState([
    { id: "skills", label: "Total Skills", value: "0", trend: "+0%", trendType: "stable" as const, iconName: "Library" },
    { id: "files", label: "Indexed Files", value: "0", trend: "+0%", trendType: "stable" as const, iconName: "FileText" },
    { id: "chats", label: "Active Chats", value: "0", trend: "+0%", trendType: "stable" as const, iconName: "MessageSquare" },
    { id: "memories", label: "Memory Nodes", value: "0", trend: "+0%", trendType: "stable" as const, iconName: "Brain" },
    { id: "capacity", label: "Storage Used", value: "0 KB", trend: "100MB Limit", trendType: "neutral" as const, iconName: "HardDrive" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [skillsRes, filesRes, chatsRes, memoriesRes] = await Promise.all([
          getAllSkillsAction(),
          getAllFilesAction(),
          getChatsCountAction(),
          getMemoriesCountAction()
        ]);

        const skillsCount = skillsRes.success && skillsRes.data ? skillsRes.data.length : 0;
        const filesCount = filesRes.success && filesRes.data ? filesRes.data.length : 0;
        const chatsCount = chatsRes.success && chatsRes.data ? chatsRes.data : 0;
        const memoriesCount = memoriesRes.success && memoriesRes.data ? memoriesRes.data : 0;

        let totalSizeBytes = 0;
        if (filesRes.success && filesRes.data) {
          totalSizeBytes = filesRes.data.reduce((sum, f) => sum + f.size, 0);
        }

        const sizeInMB = totalSizeBytes / (1024 * 1024);
        const capacityStr = sizeInMB > 1 
          ? `${sizeInMB.toFixed(2)} MB` 
          : `${(totalSizeBytes / 1024).toFixed(0)} KB`;

        setStats([
          { id: "skills", label: "Total Skills", value: String(skillsCount), trend: `+${skillsCount} dynamic`, trendType: "positive" as const, iconName: "Library" },
          { id: "files", label: "Indexed Files", value: String(filesCount), trend: `${filesCount} active`, trendType: "positive" as const, iconName: "FileText" },
          { id: "chats", label: "Active Chats", value: String(chatsCount), trend: `${chatsCount} threads`, trendType: "positive" as const, iconName: "MessageSquare" },
          { id: "memories", label: "Memory Nodes", value: String(memoriesCount), trend: `${memoriesCount} extracted`, trendType: "positive" as const, iconName: "Brain" },
          { id: "capacity", label: "Storage Used", value: capacityStr, trend: "100MB limit", trendType: "neutral" as const, iconName: "HardDrive" },
        ]);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    }

    loadStats();
  }, []);

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
          {stats.map((stat) => (
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
