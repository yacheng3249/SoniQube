import { create } from "zustand";

const useLibraryStatusStore = create((set) => ({
  libraryStatus: false,
  setLibraryStatus: () => {
    set((state) => ({ libraryStatus: !state.libraryStatus }));
  },
}));

export default useLibraryStatusStore;
