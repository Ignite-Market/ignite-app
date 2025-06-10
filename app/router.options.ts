import type { RouterConfig } from '@nuxt/schema';

export default {
  scrollBehavior: (to, from, _savedPosition) => {
    const scrolls = useScrollStore();

    // Save the position of scroll on the page that the user has just left
    if (typeof document !== 'undefined') {
      const scrollEl = document.querySelector('#ignite-scroll > .n-scrollbar-container');

      if (scrollEl) {
        scrolls.savePosition(from.fullPath, scrollEl.scrollTop);
      }
    }

    // scroll to saved position on forward/back navigation
    if (scrolls.positions[to.fullPath]) {
      setTimeout(() => {
        const scrollEl = document.querySelector('#ignite-scroll > .n-scrollbar-container');
        scrollEl?.scrollTo({
          left: 0,
          top: scrolls.positions[to.fullPath] || 0,
          behavior: 'smooth',
        });
      }, 150);
    }
  },
} satisfies RouterConfig;
