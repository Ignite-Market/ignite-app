import { useAccount } from '@wagmi/vue';

/**
 * Tells if user is logged in and connected.
 */
export default function useLoggedIn() {
  const userStore = useUserStore();
  const { isConnected } = useAccount();

  const loggedIn = computed(() => {
    return userStore.loggedIn && isConnected.value;
  });

  return {
    loggedIn,
  };
}
