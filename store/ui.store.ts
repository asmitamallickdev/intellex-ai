import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  activePanel: "chat" | "knowledge" | "models";
  theme: "light" | "dark";
  
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSettings: () => void;
  setSettingsOpen: (isOpen: boolean) => void;
  setActivePanel: (panel: "chat" | "knowledge" | "models") => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSettingsOpen: false,
  activePanel: "chat",
  theme: "dark",
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  setActivePanel: (activePanel) => set({ activePanel }),
  setTheme: (theme) => set({ theme }),
}));
