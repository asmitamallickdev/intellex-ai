import { create } from "zustand";
import { MemoryNode, MemoryLink } from "@/types/memory";

interface MemoryState {
  nodes: MemoryNode[];
  links: MemoryLink[];
  healthScore: number;
  latencyMs: number;
  isLoading: boolean;
  
  setMemoryGraph: (nodes: MemoryNode[], links: MemoryLink[], healthScore: number) => void;
  setLatency: (ms: number) => void;
  setLoading: (status: boolean) => void;
  addNode: (node: MemoryNode) => void;
  optimizeLocalGraph: () => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  nodes: [],
  links: [],
  healthScore: 78,
  latencyMs: 180,
  isLoading: false,
  
  setMemoryGraph: (nodes, links, healthScore) => set({ nodes, links, healthScore }),
  setLatency: (latencyMs) => set({ latencyMs }),
  setLoading: (isLoading) => set({ isLoading }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  optimizeLocalGraph: () => set({ healthScore: 95, latencyMs: 120 }),
}));
