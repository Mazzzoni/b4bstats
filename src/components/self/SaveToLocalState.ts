import { atom } from "recoil";

export const state = atom<boolean>({
  key: "SaveToLocal",
  default: false,
});

export default state;
