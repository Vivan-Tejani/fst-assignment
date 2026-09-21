import { create } from "zustand";

interface TicketStore {
  filter: string;
  setFilter: (f: string) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  filter: "ALL",
  setFilter: (f) => set({ filter: f }),
}));
