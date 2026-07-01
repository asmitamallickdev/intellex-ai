"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skill } from "@/lib/skills-mock-data";

// Sub-components
import ModalHeader from "./create-skill-modal/modal-header";
import SkillNameInput from "./create-skill-modal/skill-name-input";
import DescriptionInput from "./create-skill-modal/description-input";
import CategoryDropdown from "./create-skill-modal/category-dropdown";
import IconPicker from "./create-skill-modal/icon-picker";
import ColorPicker from "./create-skill-modal/color-picker";
import TagInput from "./create-skill-modal/tag-input";
import KnowledgeUploader from "./create-skill-modal/knowledge-uploader";
import UploadedFileCard from "./create-skill-modal/uploaded-file-card";
import AdvancedSettings, { AdvancedSettingsData } from "./create-skill-modal/advanced-settings";
import ModalFooter from "./create-skill-modal/modal-footer";

interface CreateSkillModalProps {
  onClose: () => void;
  onCreate: (
    skillData: Omit<Skill, "id" | "documents" | "chats" | "memories" | "storage" | "lastUpdated" | "lastUpdatedMs" | "createdAt" | "createdAtMs" | "isPinned">,
    files: File[]
  ) => void;
}

interface FilePlaceholder {
  file: File;
  name: string;
  size: string;
  type: string;
}

export default function CreateSkillModal({
  onClose,
  onCreate,
}: CreateSkillModalProps) {
  // Form fields states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Brain");
  const [selectedColor, setSelectedColor] = useState("violet");
  const [tags, setTags] = useState<string[]>([]);
  const [stagedFiles, setStagedFiles] = useState<FilePlaceholder[]>([]);
  const [advancedData, setAdvancedData] = useState<AdvancedSettingsData>({
    embeddingStrategy: "Default",
    chunkSize: "Medium",
    memoryExtraction: true,
    autoSummaries: false,
    enableOcr: false,
  });

  // Validation & loading states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Staged files handlers
  const handleAddFile = (file: File) => {
    // Prevent duplicate filenames
    if (stagedFiles.some((f) => f.name === file.name)) {
      toast.error(`File "${file.name}" is already staged.`);
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    let sizeStr = file.size > 1024 * 1024 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    setStagedFiles((prev) => [...prev, {
      file,
      name: file.name,
      size: sizeStr,
      type: ext
    }]);
    toast.success(`Staged file "${file.name}"`);
  };

  const handleRemoveFile = (index: number) => {
    const target = stagedFiles[index];
    setStagedFiles((prev) => prev.filter((_, idx) => idx !== index));
    if (target) {
      toast.info(`Removed staged file "${target.name}"`);
    }
  };

  const handleUploaderError = (errMsg: string) => {
    toast.error(errMsg);
  };

  // Form submit validation & simulation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Required Fields
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) {
      nextErrors.name = "Skill Name is required";
    }
    if (!category) {
      nextErrors.category = "Category selection is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fill in all required fields.", {
        style: { background: "#09090b", color: "#f4f4f5", border: "1px solid #27272a" },
      });
      return;
    }

    // Clear previous validation errors & trigger loading spinner
    setErrors({});
    setIsLoading(true);

    const fileObjects = stagedFiles.map((sf) => sf.file);
    onCreate(
      {
        name: name.trim(),
        description: description.trim(),
        category,
        icon: selectedIcon,
        color: selectedColor,
        tags,
      },
      fileObjects
    );
    setIsLoading(false);
  };

  // Clear single validation error upon field change
  const handleNameChange = (val: string) => {
    setName(val);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        onClick={!isLoading ? onClose : undefined}
        className="absolute inset-0 bg-black/45 dark:bg-black/85 backdrop-blur-xs"
      />

      {/* Center Modal Dialog Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl z-10 overflow-y-auto max-h-[90vh] space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent"
      >
        {/* Header Title block */}
        <ModalHeader onClose={onClose} />

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Skill Name Field */}
          <SkillNameInput
            value={name}
            onChange={handleNameChange}
            error={errors.name}
          />

          {/* 2. Description Area */}
          <DescriptionInput
            value={description}
            onChange={setDescription}
          />

          {/* 3. Category selector */}
          <CategoryDropdown
            value={category}
            onChange={handleCategoryChange}
            error={errors.category}
          />

          {/* 4. Skill Icon Selector */}
          <IconPicker
            selectedIcon={selectedIcon}
            onChange={setSelectedIcon}
            accentColor={selectedColor}
          />

          {/* 5. Accent color circles picker */}
          <ColorPicker
            selectedColor={selectedColor}
            onChange={setSelectedColor}
          />

          {/* 6. Tag pills input */}
          <TagInput
            tags={tags}
            onChange={setTags}
          />

          {/* 7. Knowledge document uploader */}
          <KnowledgeUploader
            onFileAdd={handleAddFile}
            onError={handleUploaderError}
          />

          {/* Staged files collection list */}
          {stagedFiles.length > 0 && (
            <div className="space-y-2 mt-2 bg-zinc-50 dark:bg-zinc-955/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-900/60">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Staged Knowledge Documents ({stagedFiles.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stagedFiles.map((file, idx) => (
                  <UploadedFileCard
                    key={`${file.name}-${idx}`}
                    file={file}
                    onRemove={() => handleRemoveFile(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 8. Collapsible advanced parameters settings */}
          <AdvancedSettings
            data={advancedData}
            onChange={setAdvancedData}
          />

          {/* 9. Action footer buttons (Submit with Loader spinner, Cancel) */}
          <ModalFooter
            onCancel={onClose}
            isSubmitDisabled={isLoading}
            isLoading={isLoading}
          />

        </form>
      </motion.div>
    </div>
  );
}
