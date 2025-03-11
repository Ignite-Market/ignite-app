<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <Spinner />
    </div>
    <div v-else>
      <div class="flex justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <jazzicon
            class="cursor-pointer rounded-[50%] w-[80px] h-[80px]"
            :address="user?.walletAddress"
            :diameter="80"
          />
          <div class="flex flex-col gap-2">
            <div class="text-lg">{{ user?.username }}</div>
            <button
              class="flex gap-1 items-center px-2 rounded-lg bg-grey-light"
              @click="copyToClipboard(user?.walletAddress || '')"
            >
              {{ shortenAddress(user?.walletAddress || '') }}
              <NuxtIcon class="ml-2 text-white cursor-pointer" name="icon/copy" />
            </button>
            <div v-if="user?.createTime" class="text-sm">
              Joined {{ new Date(user.createTime).toLocaleDateString() }}
            </div>
          </div>
        </div>
        <div v-if="isCurrentUser">
          <BasicButton to="/profile/edit">Edit Profile</BasicButton>
        </div>
      </div>
      <div v-if="user" class="mt-4">
        <ProfileLists :user-id="user.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  id: { type: Number, default: null },
});

const message = useMessage();
const router = useRouter();
const { loggedIn, user: authUser } = useUserStore();

const isCurrentUser = computed(() => user.value?.id === authUser.id);

const loading = ref(false);
const user = ref<UserInterface | null>(null);

onMounted(() => {
  getUserProfile();
});

async function getUserProfile() {
  loading.value = true;
  try {
    if (!props.id) {
      if (!loggedIn) {
        message.error('Not logged in!');
        router.push('/');
      }
      const res = await $api.get<UserProfileResponse>(Endpoints.me);
      user.value = res.data;
    } else {
      const res = await $api.get<UserProfileResponse>(Endpoints.user(props.id));
      user.value = res.data;
    }
  } catch (error) {
    console.error(error);
    message.error('Failed to load user profile');
    router.push('/');
  }
  loading.value = false;
}
</script>
