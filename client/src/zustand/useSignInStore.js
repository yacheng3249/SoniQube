import { create } from "zustand";

const initialState = {
  token: null,
};

const useSignInStore = create((set) => ({
  ...initialState,
  setToken: (token) => {
    return new Promise((resolve, reject) => {
      if (typeof token !== "string") {
        return reject("failed");
      }
      set({ token });
      return resolve(200);
    });
  },
  removeToken: () => {
    return new Promise((resolve) => {
      set({ token: initialState.token });
      return resolve(200);
    });
  },
}));

export default useSignInStore;
