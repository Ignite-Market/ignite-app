import { useAccount } from '@wagmi/vue';

/**
 * Tells if user is logged in and connected.
 * @param onInit Optional callback to run after initialization
 */
export default function useLoggedIn(onInit?: (loggedIn: boolean) => void) {
  const userStore = useUserStore();
  const { isConnected, isConnecting } = useAccount();
  const isInitializing = ref(true);

  const loggedIn = computed(() => {
    return userStore.loggedIn && (isConnected.value || isConnecting.value);
  });

  // Watch for connection state changes
  watch(
    [isConnected, isConnecting],
    () => {
      if (!isConnecting.value) {
        isInitializing.value = false;
        // Use nextTick to ensure loggedIn is computed
        nextTick(() => {
          onInit?.(loggedIn.value);
        });
      }
    },
    { immediate: true }
  );

  return {
    loggedIn,
    isInitializing,
  };
}
