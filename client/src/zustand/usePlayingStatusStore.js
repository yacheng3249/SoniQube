import { create } from "zustand";

const usePlayingStatusStore = create((set) => ({
  isPlaying: false,
  setPlayingStatus: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
}));

export default usePlayingStatusStore;
