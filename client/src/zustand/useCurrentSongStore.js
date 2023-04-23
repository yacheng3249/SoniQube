import { create } from "zustand";
import data from "../data.js";
import { persist } from "zustand/middleware";

const initialState = {
  currentSong: null,
  currentSongId: null,
};

const changeState = (set, get) => ({
  setCurrentId: (song) => {
    set(() => ({ currentSongId: song.id }));
  },
  setCurrentSong: (song) => {
    set(() => ({ currentSong: song }));
  },
  removeCurrentSong: () => {
    return new Promise((resolve) => {
      set({ currentSong: initialState.currentSong });
      return resolve(200);
    });
  },
  // setCurrentSong: (song) => {
  //   let selectedSong;
  //   const newSongs = get().songs.map((e) => {
  //     if (e.id === song.id) {
  //       selectedSong = {
  //         ...e,
  //         active: true,
  //       };
  //       return selectedSong;
  //     } else {
  //       return {
  //         ...e,
  //         active: false,
  //       };
  //     }
  //   });
  //   set(() => ({ currentSong: selectedSong, songs: newSongs }));
  // },
  // setCurrentSongForward: (currentSong) => {
  //   const currentIndex = get().songs.findIndex(
  //     (song) => song.name === currentSong.name
  //   );
  //   const nextIndex = (currentIndex + 1) % get().songs.length;
  //   get().songs[currentIndex].active = false;
  //   get().songs[nextIndex].active = true;
  //   set((state) => ({
  //     currentSong: state.songs[nextIndex],
  //   }));
  // },
  // setCurrentSongBack: (currentSong) => {
  //   const currentIndex = get().songs.findIndex(
  //     (song) => song.name === currentSong.name
  //   );
  //   const preIndex =
  //     (currentIndex - 1) % get().songs.length === -1
  //       ? get().songs.length - 1
  //       : currentIndex - 1;
  //   get().songs[currentIndex].active = false;
  //   get().songs[preIndex].active = true;
  //   set((state) => ({
  //     currentSong: state.songs[preIndex],
  //   }));
  // },
});

const useCurrentSongStore = create(
  // persist(
  (set, get) => ({
    ...initialState,
    ...changeState(set, get),
  }),
  {
    name: "songs-store",
  }
  // )
);

export default useCurrentSongStore;
