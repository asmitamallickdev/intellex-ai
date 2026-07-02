"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SkillsHeader from "./skills-header";
import SkillsControls from "./skills-controls";
import PinnedSkills from "./pinned-skills";
import RecentSkills from "./recent-skills";
import SkillGrid from "./skill-grid";
import CreateSkillModal from "./create-skill-modal";
import { Skill } from "@/lib/skills-mock-data";
import { toast } from "sonner";
import { 
  getAllSkillsAction, 
  createSkillAction, 
  deleteSkillAction, 
  pinSkillAction, 
  unpinSkillAction,
  updateSkillAction 
} from "@/src/actions/skill.actions";
import { uploadFileAction } from "@/src/actions/upload.actions";
import { triggerIngestionAction } from "@/src/actions/ingestion.actions";

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"All" | "Recently Updated" | "Most Documents" | "Most Chats" | "Pinned">("All");
  const [sortBy, setSortBy] = useState<"Name" | "Last Updated" | "Created Date">("Name");
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Load skills from database on mount, auto-seeding if empty
  React.useEffect(() => {
    async function loadSkills() {
      setLoading(true);
      try {
        const res = await getAllSkillsAction();
        if (res.success && res.data) {
          const mapped: Skill[] = res.data.map((dbSkill: any) => ({
            id: dbSkill.id,
            name: dbSkill.name,
            description: dbSkill.description || "",
            category: dbSkill.category || "General",
            icon: dbSkill.icon || "Brain",
            color: dbSkill.color || "violet",
            documents: dbSkill._count?.knowledgeFiles ?? 0,
            chats: dbSkill._count?.chats ?? 0,
            memories: 0,
            storage: "0 KB",
            lastUpdated: "Just now",
            lastUpdatedMs: new Date(dbSkill.updatedAt).getTime(),
            createdAt: new Date(dbSkill.createdAt).toISOString().split("T")[0],
            createdAtMs: new Date(dbSkill.createdAt).getTime(),
            isPinned: dbSkill.isPinned,
            tags: [],
          }));
          setSkills(mapped);
        }
      } catch (err) {
        console.error("Error loading skills from database:", err);
        toast.error("Failed to sync skills with database.");
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  // Trigger modal open if URL query has ?create=true
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("create") === "true") {
        setCreateModalOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  // Card action handlers interacting directly with the DB
  const handlePinToggle = async (id: string) => {
    const target = skills.find((s) => s.id === id);
    if (!target) return;

    try {
      const nextState = !target.isPinned;
      if (nextState) {
        await pinSkillAction(id);
      } else {
        await unpinSkillAction(id);
      }

      setSkills((prev) =>
        prev.map((skill) => (skill.id === id ? { ...skill, isPinned: nextState } : skill))
      );
      toast.success(nextState ? `Pinned "${target.name}"` : `Unpinned "${target.name}"`);
    } catch (err) {
      toast.error("Failed to update pin state.");
    }
  };

  const handleDelete = async (id: string) => {
    const target = skills.find((s) => s.id === id);
    if (!target) return;

    try {
      await deleteSkillAction(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.error(`Deleted workspace "${target.name}"`);
    } catch (err) {
      toast.error("Failed to delete workspace.");
    }
  };

  const handleDuplicate = async (id: string) => {
    const target = skills.find((s) => s.id === id);
    if (!target) return;

    try {
      const res = await createSkillAction({
        name: `${target.name} (Copy)`,
        description: target.description,
        category: target.category,
        icon: target.icon,
        color: target.color,
      });

      if (res.success && res.data) {
        const duplicated: Skill = {
          ...target,
          id: res.data.id,
          name: res.data.name,
          isPinned: false,
          lastUpdated: "Just now",
          lastUpdatedMs: Date.now(),
          createdAtMs: Date.now(),
        };

        setSkills((prev) => [duplicated, ...prev]);
        toast.success(`Duplicated "${target.name}"`);
      } else {
        toast.error(res.error || "Failed to duplicate skill.");
      }
    } catch (err) {
      toast.error("Failed to duplicate skill.");
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await updateSkillAction(id, { name: newName });
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, name: newName, lastUpdated: "Just now", lastUpdatedMs: Date.now() } : s))
      );
      toast.success(`Renamed workspace to "${newName}"`);
    } catch (err) {
      toast.error("Failed to rename skill.");
    }
  };

  // Add new skill created from the Modal and save to Neon DB
  const handleCreateSkill = async (
    newSkillData: Omit<Skill, "id" | "documents" | "chats" | "memories" | "storage" | "lastUpdated" | "lastUpdatedMs" | "createdAt" | "createdAtMs" | "isPinned">,
    files: File[]
  ) => {
    try {
      const res = await createSkillAction({
        name: newSkillData.name,
        description: newSkillData.description,
        category: newSkillData.category,
        icon: newSkillData.icon,
        color: newSkillData.color,
      });

      if (res.success && res.data) {
        const skillId = res.data.id;
        const newSkill: Skill = {
          id: skillId,
          name: res.data.name,
          description: res.data.description || "",
          category: res.data.category || "General",
          icon: res.data.icon || "Brain",
          color: res.data.color || "violet",
          documents: files.length,
          chats: 0,
          memories: 0,
          storage: files.length > 0 ? "Calculating..." : "0 KB",
          lastUpdated: "Just now",
          lastUpdatedMs: Date.now(),
          createdAt: new Date().toISOString().split("T")[0],
          createdAtMs: Date.now(),
          isPinned: false,
          tags: newSkillData.tags || [],
        };

        setSkills((prev) => [newSkill, ...prev]);
        setCreateModalOpen(false);
        toast.success(`Successfully created skill "${newSkill.name}"!`);

        // Process document uploads in the background
        if (files.length > 0) {
          toast.info(`Uploading and processing ${files.length} knowledge documents...`);
          for (const file of files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
              try {
                const base64Data = (reader.result as string).split(",")[1];
                const uploadRes = await uploadFileAction(
                  skillId,
                  file.name,
                  file.type || "application/octet-stream",
                  file.size,
                  base64Data
                );

                if (uploadRes.success && uploadRes.data) {
                  const ingestRes = await triggerIngestionAction(uploadRes.data.id);
                  if (ingestRes.success) {
                    toast.success(`Knowledge file "${file.name}" indexed successfully!`);
                  } else {
                    toast.error(`Ingestion failed for "${file.name}": ${ingestRes.error}`);
                  }
                } else {
                  toast.error(`Upload failed for "${file.name}": ${uploadRes.error}`);
                }
              } catch (uploadErr: any) {
                console.error(`Error uploading "${file.name}":`, uploadErr);
                toast.error(`Error processing "${file.name}": ${uploadErr.message}`);
              }
            };
          }
        }
      } else {
        toast.error(res.error || "Failed to create skill.");
      }
    } catch (err) {
      toast.error("Failed to create skill.");
    }
  };

  const handleOpen = (id: string) => {
    setNavigating(true);
    router.push(`/chat/${id}`);
  };

  // 1. Filter Logic
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // Search matching
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter option matching
      switch (filterBy) {
        case "Pinned":
          return skill.isPinned;
        case "Recently Updated":
          return Date.now() - skill.lastUpdatedMs < 48 * 60 * 60 * 1000;
        case "Most Documents":
          return skill.documents >= 35;
        case "Most Chats":
          return skill.chats >= 100;
        case "All":
        default:
          return true;
      }
    });
  }, [skills, searchQuery, filterBy]);

  // 2. Sort Logic
  const sortedSkills = useMemo(() => {
    return [...filteredSkills].sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "Last Updated") {
        return b.lastUpdatedMs - a.lastUpdatedMs;
      }
      if (sortBy === "Created Date") {
        return b.createdAtMs - a.createdAtMs;
      }
      return 0;
    });
  }, [filteredSkills, sortBy]);

  // Pinned Skills List (Always selected from the master list)
  const pinnedSkills = useMemo(() => {
    return skills.filter((s) => s.isPinned).slice(0, 3);
  }, [skills]);

  // Recently Accessed (Mocked to show 3 skills updated most recently)
  const recentSkills = useMemo(() => {
    return [...skills]
      .sort((a, b) => b.lastUpdatedMs - a.lastUpdatedMs)
      .slice(0, 2);
  }, [skills]);

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8 select-none">
        <SkillsHeader onCreateClick={() => setCreateModalOpen(true)} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-800/60 bg-gray-900/40 p-5 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-gray-800 rounded-md w-3/4" />
                  <div className="h-2.5 bg-gray-800/60 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-2.5 bg-gray-800/60 rounded-md w-full" />
              <div className="h-2.5 bg-gray-800/60 rounded-md w-5/6" />
              <div className="flex gap-3 pt-1">
                <div className="h-2 bg-gray-800/40 rounded-md w-12" />
                <div className="h-2 bg-gray-800/40 rounded-md w-12" />
                <div className="h-2 bg-gray-800/40 rounded-md w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-slate-50/80 dark:bg-gray-950/90 backdrop-blur-sm gap-4 select-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full bg-orange-500/20 blur-xl animate-pulse" />
            <Loader2 className="w-10 h-10 text-orange-600 dark:text-orange-400 animate-spin relative z-10" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[10px] text-gray-500 dark:text-gray-300 font-bold uppercase tracking-widest">
              Opening workspace...
            </p>
          </div>
        </div>
      )}
      <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <SkillsHeader onCreateClick={() => setCreateModalOpen(true)} />

      {/* Recently Accessed Spaces Banner */}
      {recentSkills.length > 0 && <RecentSkills skills={recentSkills} />}

      {/* Pinned Spaces Section */}
      {pinnedSkills.length > 0 && (
        <PinnedSkills skills={pinnedSkills} onPinToggle={handlePinToggle} />
      )}

      {/* Grid Controls (Search, Filters, Sort, Grid/List) */}
      <SkillsControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterBy={filterBy}
        onFilterChange={setFilterBy}
        sortBy={sortBy}
        onSortChange={setSortBy}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
      />

      {/* Skills Grid */}
      <SkillGrid
        skills={sortedSkills}
        layoutMode={layoutMode}
        onPinToggle={handlePinToggle}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onRename={handleRename}
        onCreateClick={() => setCreateModalOpen(true)}
        onOpen={handleOpen}
      />

      {/* Create Skill Modal Dialog */}
      {createModalOpen && (
        <CreateSkillModal
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateSkill}
        />
      )}
    </div>
    </>
  );
}
