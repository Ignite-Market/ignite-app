import { defineStore } from 'pinia';

export const useScrollStore = defineStore('scroll', {
  state: () => ({
    positions: {} as { [fullPath: string]: number },
  }),
  actions: {
    savePosition(fullPath: string, position: number) {
      if (!fullPath) {
        return;
      }
      this.positions[fullPath] = position;
    },
  },
});
