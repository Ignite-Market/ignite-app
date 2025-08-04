import { useDisconnect } from '@wagmi/vue';
import { defineStore } from 'pinia';
import Endpoints from '~/lib/values/endpoints';
import { PARAMS_ALL_ITEMS, WebStorageKeys } from '~/lib/values/general.values';

function UserPointsFactory() {
  return {
    totalPoints: 0,
    marketFundingPoints: 0,
    buyingSharesPoints: 0,
    sellingSharesPoints: 0,
    marketWinnerPoints: 0,
    proposalWinnerPoints: 0,
    proposalVotePoints: 0,
    dailyLoginPoints: 0,
    referralPoints: 0,
    referralCount: 0,
  };
}

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: '',
    initialized: false, // user has been reloaded once already this session
    loadingProfile: false,
    notifications: {
      loading: false,
      items: [] as NotificationInterface[],
    },
    promises: {
      profile: null as any,
    },

    user: {} as UserInterface,

    points: UserPointsFactory(),
    pointsLoading: false,
  }),
  getters: {
    loggedIn(state) {
      return !!state.jwt;
    },
    hasNotifications(state) {
      return Array.isArray(state.notifications.items) && state.notifications.items.length > 0;
    },
    isAdmin(state) {
      return state.user?.roles?.some(r => r.name === 'ADMIN');
    },
  },
  actions: {
    logout() {
      try {
        this.$reset();
        $api.clearToken();

        const { disconnect } = useDisconnect();
        disconnect();
      } catch (e) {}
    },

    saveUser(userData: AuthInterface) {
      this.user = { ...userData };

      if (userData.token) {
        this.setUserToken(userData.token);
      }
    },

    setUserToken(token: string) {
      this.jwt = token;
      $api.setToken(token);
    },

    /**
     * API calls
     */
    initUser() {
      if (this.jwt && !this.initialized) {
        this.setUserToken(this.jwt);
        // this.user = this.getUserData();
        this.promises.profile = this.getUserData();
        this.getUserPoints();
        this.initialized = true;
      }
    },

    async getUserData() {
      this.loadingProfile = true;
      try {
        const res = await $api.get<UserResponse>(Endpoints.me);

        if (res.data) {
          this.saveUser(res.data);
        }
        setTimeout(() => {
          this.loadingProfile = false;
        }, 10);

        return res;
      } catch (error) {
        /** On error - logout */
        console.error(error);
        this.logout();

        setTimeout(() => {
          this.loadingProfile = false;
        }, 700);
        return null;
      }
    },

    /** Notifications */
    async getNotifications(force = false) {
      if (this.hasNotifications || !force) return;

      this.notifications.loading = true;
      try {
        const params = parseArguments({ limit: PARAMS_ALL_ITEMS.limit });
        const { data } = await $api.get<NotificationsResponse>(Endpoints.notification, params);
        this.notifications.items = data.items;
      } catch (error: any) {
        this.notifications.items = [] as NotificationInterface[];

        /** Show error message */
        window.$message.error(apiError(error));
      } finally {
        this.notifications.loading = false;
      }
    },

    async getUserPoints() {
      if (!this.loggedIn) {
        this.pointsLoading = false;
        return;
      }

      if (this.pointsLoading) {
        return;
      }

      this.pointsLoading = true;

      try {
        const res = await $api.get<GeneralResponse<ReturnType<typeof UserPointsFactory>>>(Endpoints.rewardsMe);
        this.points = res.data;
      } catch (error) {
        window.$message.error(apiError(error));
      } finally {
        this.pointsLoading = false;
      }
    },
  },
  persist: {
    key: WebStorageKeys.USER_STORE,
    storage: localStorage,
    pick: ['jwt', 'notifications', 'user'],
  },
});
