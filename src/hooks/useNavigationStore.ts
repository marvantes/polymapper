import { create } from "zustand";

interface NavigationStore {
  isSaving: boolean;
  isDrawingEnabled: boolean;
  isEditEnabled: boolean;
  isCreated: boolean;
  hasDrawn: boolean;
  reset: () => void;
  setSaving: (value: boolean) => void;
  setDrawingEnabled: (value: boolean) => void;
  setEditEnabled: (value: boolean) => void;
  setCreated: (value: boolean) => void;
  setDrawn: (value: boolean) => void;
}

const useNavigationStore = create<NavigationStore>((set) => ({
  isSaving: false,
  isDrawingEnabled: false,
  isCreated: false,
  isEditEnabled: false,
  hasDrawn: false,
  reset: () =>
    set({
      isSaving: false,
      isDrawingEnabled: false,
      isEditEnabled: false,
      isCreated: false,
      hasDrawn: false,
    }),
  setSaving: (value: boolean) => set({ isSaving: value, isCreated: true }),
  setDrawingEnabled: (value: boolean) => set({ isDrawingEnabled: value }),
  setEditEnabled: (value: boolean) => set({ isEditEnabled: value }),
  setCreated: (value: boolean) => set({ isCreated: value }),
  setDrawn: (value: boolean) => set({ hasDrawn: value }),
}));

export default useNavigationStore;
