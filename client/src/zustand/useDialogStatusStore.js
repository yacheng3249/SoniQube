import { create } from "zustand";

const initialState = {
  dialogStatus: false,
  dialogContent: {},
};

const useDialogStatusStore = create((set) => ({
  ...initialState,
  setDialogStatusActive: () => {
    set(() => ({ dialogStatus: true }));
  },
  setDialogStatusInactive: () => {
    set(() => ({ dialogStatus: initialState.dialogStatus }));
  },
  setDialogContent: (title, message) => {
    set(() => ({ dialogContent: { title, message } }));
  },
}));

export default useDialogStatusStore;
