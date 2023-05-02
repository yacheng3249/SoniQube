import { create } from "zustand";

const usePlayingStatusStore = create((set) => ({
  isPlaying: false,
  setPlayingStatus: () => {
    return new Promise((resolve, reject) => {
      set((state) => ({ isPlaying: !state.isPlaying }));
      return resolve(200);
    });
  },
}));

export default usePlayingStatusStore;
