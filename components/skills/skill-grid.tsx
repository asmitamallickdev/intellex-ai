"use client";

import React from "react";
import { Skill } from "@/lib/skills-mock-data";
import SkillCard from "./skill-card";
import EmptyState from "./empty-state";
import { cn } from "@/lib/utils";

interface SkillGridProps {
  skills: Skill[];
  layoutMode: "grid" | "list";
  onPinToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onCreateClick: () => void;
  onOpen: (id: string) => void;
}

export default function SkillGrid({
  skills,
  layoutMode,
  onPinToggle,
  onDelete,
  onDuplicate,
  onRename,
  onCreateClick,
  onOpen,
}: SkillGridProps) {
  // Render empty state if there are no skills
  if (skills.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div
      className={cn(
        "transition-all duration-300",
        layoutMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
      )}
    >
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          layoutMode={layoutMode}
          onPinToggle={onPinToggle}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onRename={onRename}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
