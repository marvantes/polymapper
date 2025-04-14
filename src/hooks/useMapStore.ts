import { create } from "zustand";
import { Map } from "ol";
import { Draw, Modify } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { LineString } from "ol/geom";

interface MapStore {
  vectorSource: VectorSource;
  map: Map | null;
  draw: Draw | null;
  modify: Modify | null;
  currentFeature: Feature<LineString> | null;
  setVectorSource: (source: VectorSource) => void;
  setMap: (map: Map | null) => void;
  setDraw: (draw: Draw | null) => void;
  setModify: (modify: Modify | null) => void;
  setCurrentFeature: (feature: Feature<LineString> | null) => void;
  resetMapStore: () => void;
}

const useMapStore = create<MapStore>((set: any) => ({
  vectorSource: new VectorSource({ wrapX: false }),
  map: null,
  draw: null,
  modify: null,
  currentFeature: null,
  setVectorSource: (source: VectorSource) => set({ vectorSource: source }),
  setMap: (map: Map | null) => set({ map }),
  setDraw: (draw: Draw | null) => set({ draw }),
  setModify: (modify: Modify | null) => set({ modify }),
  setCurrentFeature: (feature: Feature<LineString> | null) =>
    set({ currentFeature: feature }),
  resetMapStore: () =>
    set((state: any) => {
      state.vectorSource.clear();
      return {
        vectorSource: state.vectorSource,
      };
    }),
}));

export default useMapStore;
