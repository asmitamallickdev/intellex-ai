import { create } from "zustand";

export interface UploadQueueItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "queued" | "uploading" | "indexing" | "completed" | "failed";
  error?: string;
}

interface UploadState {
  queue: UploadQueueItem[];
  isDragging: boolean;
  
  setDragging: (dragging: boolean) => void;
  addToQueue: (items: UploadQueueItem[]) => void;
  updateProgress: (id: string, progress: number, status?: UploadQueueItem["status"]) => void;
  setError: (id: string, errorMessage: string) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  queue: [],
  isDragging: false,
  
  setDragging: (isDragging) => set({ isDragging }),
  addToQueue: (items) => set((state) => ({ queue: [...state.queue, ...items] })),
  updateProgress: (id, progress, status) => set((state) => ({
    queue: state.queue.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          progress,
          status: status || item.status,
        };
      }
      return item;
    }),
  })),
  setError: (id, error) => set((state) => ({
    queue: state.queue.map((item) => item.id === id ? { ...item, status: "failed", error } : item),
  })),
  removeFromQueue: (id) => set((state) => ({
    queue: state.queue.filter((item) => item.id !== id),
  })),
  clearQueue: () => set({ queue: [] }),
}));
