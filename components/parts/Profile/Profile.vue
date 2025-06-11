<template>
  <div class="profile-container">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <Spinner />
    </div>
    <div v-else class="bg-grey-dark rounded-2xl shadow-lg">
      <div class="flex justify-between flex-wrap gap-6">
        <div class="flex items-start gap-6">
          <div class="relative">
            <jazzicon
              class="cursor-pointer rounded-full w-[108px] h-[108px] shadow-md hover:shadow-lg transition-shadow duration-200"
              :address="user?.walletAddress"
              :diameter="108"
            />
          </div>
          <div class="flex flex-col gap-3">
            <h1 class="text-2xl font-bold text-white">{{ user?.username }}</h1>
            <button
              class="w-fit inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-grey-light hover:bg-grey transition-colors duration-200 whitespace-nowrap"
              @click="copyToClipboard(user?.walletAddress || '')"
            >
              <span class="text-sm whitespace-nowrap text-white/80">{{
                shortenAddress(user?.walletAddress || '')
              }}</span>
              <NuxtIcon class="text-white/80 cursor-pointer flex-shrink-0" name="icon/copy" />
            </button>
            <div v-if="user?.createTime" class="text-sm text-white/30">
              Joined {{ new Date(user.createTime).toLocaleDateString() }}
            </div>
          </div>
        </div>
        <div v-if="isCurrentUser" class="self-start">
          <BasicButton to="/profile/edit" class="hover:opacity-90 transition-opacity duration-200">
            Edit Profile
          </BasicButton>
        </div>
      </div>
      <div v-if="user" class="mt-8 border-t border-grey pt-6">
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
const { user: authUser } = useUserStore();

const isCurrentUser = computed(() => user.value?.id === authUser.id);

const loading = ref(true);
const user = ref<UserInterface | null>(null);

const { loggedIn, isInitializing } = useLoggedIn(onInit);

onMounted(async () => {
  if (!isInitializing.value) {
    await getUserProfile();
  }
});

async function onInit() {
  await getUserProfile();
}

async function getUserProfile() {
  loading.value = true;
  try {
    if (!props.id) {
      if (!loggedIn.value) {
        message.error('Not logged in!');
        router.push('/');
        return;
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
