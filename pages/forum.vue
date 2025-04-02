<template>
  <Dashboard :loading="loading">
    <div class="px-4 max-w-[1241px] m-auto">
      <!-- HEADER -->
      <div class="flex mb-10 justify-between flex-wrap gap-4">
        <div class="flex flex-wrap gap-x-8 gap-y-4">
          <div class="w-[80px] h-[80px] flex-shrink-0">
            <Image src="https://images.ignitemarket.xyz/logo.png" class="rounded-[8px] w-full h-full object-cover" />
          </div>
          <div class="flex flex-col">
            <div class="text-[24px] leading-[34px] font-bold text-white mt-[5px]">Market proposals</div>
            <div class="flex mt-4 items-center">
              <div class="text-white/80 text-[14px] leading-[20px]">Submit your market ideas and earn rewards</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <!-- LEFT -->
        <div class="flex flex-col min-w-[250px] max-w-[736px]">
          <!-- Main forum content goes here -->
          <div>
            <!-- Forum content placeholder -->
            <div class="border-1 border-grey-lighter rounded-lg p-6">
              <div class="font-bold text-[18px] leading-[24px] mb-4 text-white">How Market Proposals Work</div>
              <div class="font-medium leading-[20px] mb-6 text-white/80">
                <p class="mb-4 text-white/80 text-[14px]">
                  Ignite Market allows you to propose new prediction markets on any topic you're passionate about. Each
                  round, the best proposal will receive rewards in tokens!
                </p>

                <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Submission Guidelines:</h3>
                <ul class="list-disc pl-5 mb-4 text-white/80 text-[14px]">
                  <li class="mb-0.5">
                    Clearly define your market question (e.g., "Will Bitcoin reach $100k by end of 2024?")
                  </li>
                  <li class="mb-0.5">
                    Specify possible outcomes (typically binary Yes/No, but can include multiple options)
                  </li>
                  <li class="mb-0.5">Provide resolution criteria - how will the outcome be determined?</li>
                  <li>Include any relevant images or references</li>
                </ul>

                <h3 class="font-bold text-[16px] leading-[22px] mb-2 text-white">Selection Process:</h3>
                <p class="mb-4 text-white/80 text-[14px]">
                  Each round lasts two weeks. The community votes on proposals, and the proposal with the most votes
                  will be selected and implemented as an official market. The creator will receive 100 tokens as a
                  reward!
                </p>
              </div>
            </div>

            <div class="border-1 border-grey-lighter rounded-lg mt-6 p-6">
              <!-- Reddit-style filter tabs -->
              <div class="flex items-center mb-5 border-b-1 border-grey-lighter pb-2">
                <div class="font-bold text-[18px] leading-[24px] text-white mr-2">Posts</div>

                <button
                  class="flex items-center px-2 py-1 hover:bg-grey-lighter/20 rounded-full text-white/60 text-xs font-medium border-1 border-grey-lighter mr-1.5 cursor-pointer"
                  :class="{ 'border-1 border-primary': sortFilter === Sort.TOP }"
                  @click="sortFilter = Sort.TOP"
                >
                  <NuxtIcon
                    name="icon/trophy"
                    class="mr-1 text-[14px]"
                    :class="{ '!text-primary': sortFilter === Sort.TOP }"
                  />
                  Top
                </button>

                <button
                  class="flex items-center px-2 py-1 hover:bg-grey-lighter/20 rounded-full text-white/60 text-xs font-medium border-1 border-grey-lighter cursor-pointer"
                  :class="{ 'border-1 border-primary': sortFilter === Sort.NEW }"
                  @click="sortFilter = Sort.NEW"
                >
                  New
                </button>
              </div>

              <n-input v-model:value="search" placeholder="Search proposals" size="large" class="mb-6">
                <template #prefix>
                  <NuxtIcon name="icon/search" />
                </template>
              </n-input>

              <!-- Post -->
              <div class="border-1 border-grey-lighter rounded-lg overflow-hidden">
                <!-- Voting sidebar -->
                <div class="flex">
                  <div class="bg-grey-dark p-2 pr-0 flex flex-col items-center w-12">
                    <Btn
                      btn-class="bg-grey-light h-6 w-6 rounded flex-cc hover:bg-grey-lighter rotate-180 mt-1"
                      type="link"
                    >
                      <NuxtIcon name="icon/arrow-down" class="text-[20px]" />
                    </Btn>

                    <div class="text-white font-bold py-2">23</div>

                    <Btn btn-class="bg-grey-light h-6 w-6 rounded flex-cc hover:bg-grey-lighter" type="link">
                      <NuxtIcon name="icon/arrow-down" class="text-[20px]" />
                    </Btn>
                  </div>

                  <div class="flex-1">
                    <!-- Post header -->
                    <div class="p-3 bg-grey-light/10">
                      <div class="flex items-center text-xs text-white/60">
                        <div class="flex items-center">
                          <div class="w-4 h-4 rounded-full overflow-hidden mr-1">
                            <jazzicon
                              class="cursor-pointer rounded-[50%] w-[16px] h-[16px] flex-shrink-0"
                              :address="'0xB3810C07f5073402738f15eb627d45a174AbD8b6'"
                              :diameter="16"
                              @click="openUserProfile(1)"
                            />
                          </div>
                          <span class="cursor-pointer hover:text-primary-bright" @click="openUserProfile(1)">
                            0x8fa...3e21
                          </span>
                        </div>
                        <div class="mx-2 border-r-1 border-r-white/25 h-[12px]"></div>
                        <div class="mr-2">2 days ago</div>
                        <div class="bg-grey-lighter px-2 py-0.5 rounded-full text-xs ml-1">Crypto</div>
                      </div>
                    </div>

                    <!-- Post content -->
                    <div class="p-3">
                      <div class="text-white font-medium text-[16px] mb-2 line-clamp-3">
                        Will Solana reach 1 million TPS by the end of 2024?
                      </div>
                      <div class="text-white/80 text-[14px] line-clamp-4">
                        Solana has been working on improving its transaction throughput, and they claim they can handle
                        high TPS. This market would predict whether Solana will actually reach the milestone of
                        processing 1 million transactions per second in a verifiable test by December 31, 2024. Solana
                        has been working on improving its transaction throughput, and they claim they can handle high
                        TPS. This market would predict whether Solana will actually reach the milestone of processing 1
                        million transactions per second in a verifiable test by December 31, 2024.
                      </div>
                    </div>

                    <!-- Post footer/actions -->
                    <div class="p-3 flex items-center text-white/60 text-xs">
                      <div
                        class="flex items-center justify-center mr-2 bg-grey-light hover:bg-grey-lighter p-1.5 rounded cursor-pointer group"
                      >
                        <NuxtIcon name="icon/comment" class="mr-1 text-[16px] group-hover:text-primary" />
                        <span>8 Comments</span>
                      </div>

                      <div
                        class="flex items-center justify-center bg-grey-light hover:bg-grey-lighter p-1.5 rounded cursor-pointer group"
                      >
                        <NuxtIcon name="icon/share" class="mr-1 text-[16px] group-hover:text-primary" />
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-6">
          <!-- Sidebar content -->
          <div class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="flex mb-4 justify-center">
              <div class="font-bold text-[16px] leading-[24px] text-white">Round #12</div>
              <div class="flex justify-center items-center ml-auto">
                <div class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
              </div>
            </div>

            <div class="font-medium text-[14px] leading-[20px] text-grey-lightest">
              <div
                class="flex items-center py-4 border-b-1 border-b-grey-lighter"
                :title="dateTimeToDateAndTime(new Date())"
              >
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/calendar" />
                <div>Started on:</div>
                <div class="ml-auto text-white/80 font-bold">{{ toMonthAndYear(new Date()) }}</div>
              </div>

              <div
                class="flex items-center py-4 border-b-1 border-b-grey-lighter"
                :title="dateTimeToDateAndTime(new Date())"
              >
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/flag" />
                <div>Ends on:</div>
                <div class="ml-auto text-white/80 font-bold">{{ toMonthAndYear(new Date()) }}</div>
              </div>

              <div class="flex items-center py-4" :title="dateTimeToDateAndTime(new Date())">
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/trophy" />
                <div>Reward:</div>
                <div class="flex items-center justify-center text-white/80 ml-auto font-bold">
                  <div class="mr-1">100</div>
                  <NuxtIcon name="icon/star2" class="text-primary" />
                </div>
              </div>

              <BasicButton
                class="w-full mt-4"
                :btn-class="['!font-bold']"
                :size="'large'"
                :disabled="!isConnected"
                :loading="loading"
              >
                Add proposal
              </BasicButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';

enum Sort {
  TOP = 1,
  NEW = 2,
}

const { isConnected } = useAccount();
const router = useRouter();
const userStore = useUserStore();

const search = ref('');
const sortFilter = ref(Sort.TOP);

const loading = ref(false);

function openUserProfile(userId: number) {
  if (userId === userStore.user.id) {
    router.push('/profile');
    return;
  }

  router.push({
    name: 'profile-id',
    params: { id: userId },
  });
}
</script>
