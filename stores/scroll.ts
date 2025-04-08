import { defineStore } from 'pinia';

export const useScrollStore = defineStore('scroll', {
  state: () => ({
    positions: {} as Record<string, number>,
  }),
  actions: {
    savePosition(route: string, position: number) {
      this.positions[route] = position;
    },
    getPosition(route: string): number {
      return this.positions[route] || 0;
    },
    clearPosition(route: string) {
      delete this.positions[route];
    },
  },
});
