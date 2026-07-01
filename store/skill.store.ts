import { create } from "zustand";
import { Skill } from "@/types/skill";

interface SkillState {
  skills: Skill[];
  activeSkillId: string | null;
  searchQuery: string;
  isCreateModalOpen: boolean;
  isLoading: boolean;
  
  setSkills: (skills: Skill[]) => void;
  setActiveSkillId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCreateModalOpen: (isOpen: boolean) => void;
  setLoading: (status: boolean) => void;
  addSkill: (skill: Skill) => void;
  updateSkillInStore: (id: string, updated: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  skills: [],
  activeSkillId: null,
  searchQuery: "",
  isCreateModalOpen: false,
  isLoading: false,
  
  setSkills: (skills) => set({ skills }),
  setActiveSkillId: (id) => set({ activeSkillId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
  setLoading: (isLoading) => set({ isLoading }),
  addSkill: (skill) => set((state) => ({ skills: [skill, ...state.skills] })),
  updateSkillInStore: (id, updated) => set((state) => ({
    skills: state.skills.map((s) => s.id === id ? { ...s, ...updated } : s)
  })),
  removeSkill: (id) => set((state) => ({
    skills: state.skills.filter((s) => s.id !== id)
  })),
}));
