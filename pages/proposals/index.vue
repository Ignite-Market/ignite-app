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
                <div class="font-bold text-[18px] leading-[24px] text-white mr-2">Proposals</div>

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

              <n-input v-model:value="search" placeholder="Search proposals" size="large">
                <template #prefix>
                  <NuxtIcon name="icon/search" />
                </template>
              </n-input>

              <div v-for="(proposal, idx) in proposals" :key="proposal.id">
                <div class="border-1 border-grey-lighter rounded-lg overflow-hidden mt-6 hover:border-primary">
                  <!-- Voting sidebar -->
                  <div class="flex">
                    <div class="bg-grey-dark p-2 pr-0 flex flex-col items-center w-12">
                      <Btn
                        btn-class="bg-grey-light h-6 w-6 rounded flex-cc hover:bg-grey-lighter rotate-180 mt-1"
                        :class="{
                          '!bg-grey-lighter !text-primary': proposal.votes.find(
                            v => v.user_id === userStore?.user?.id && v.voteType === ProposalVoteType.UPVOTE
                          ),
                        }"
                        type="link"
                        :disabled="!isConnected || !userStore.loggedIn || loadingVote"
                        @click="vote(proposal.id, ProposalVoteType.UPVOTE, idx)"
                      >
                        <NuxtIcon name="icon/arrow-down" class="text-[20px]" />
                      </Btn>

                      <div class="text-white font-bold py-2">
                        {{ proposal.totalVotes }}
                      </div>

                      <Btn
                        btn-class="bg-grey-light h-6 w-6 rounded flex-cc hover:bg-grey-lighter"
                        :class="{
                          '!bg-grey-lighter !text-primary': proposal.votes.find(
                            v => v.user_id === userStore?.user?.id && v.voteType === ProposalVoteType.DOWNVOTE
                          ),
                        }"
                        type="link"
                        :disabled="!isConnected || !userStore.loggedIn || loadingVote"
                        @click="vote(proposal.id, ProposalVoteType.DOWNVOTE, idx)"
                      >
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
                                :address="proposal.userWallet"
                                :diameter="16"
                                @click="openUserProfile(1)"
                              />
                            </div>
                            <span
                              class="cursor-pointer hover:text-primary-bright"
                              @click="openUserProfile(proposal.user_id)"
                            >
                              {{ proposal.username }}
                            </span>
                          </div>
                          <div class="mx-2 border-r-1 border-r-white/25 h-[12px]"></div>
                          <div class="mr-2" :title="dateTimeToDateAndTime(proposal.createTime)">
                            {{ formatDistanceToNow(new Date(proposal.createTime), { addSuffix: true }) }}
                          </div>
                          <div class="bg-grey-lighter px-2 py-0.5 rounded-full text-xs ml-1">Crypto</div>
                        </div>
                      </div>

                      <!-- Post content -->
                      <div
                        class="p-3 cursor-pointer"
                        @click="
                          router.push({
                            name: 'proposals-id',
                            params: { id: proposal.id },
                          })
                        "
                      >
                        <div class="text-white font-medium text-[16px] mb-2 line-clamp-3">
                          {{ proposal.question }}
                        </div>
                        <div class="text-white/80 text-[14px] line-clamp-4">
                          {{ proposal.generalResolutionDef }}
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
              <!-- Post -->
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px] mb-6">
          <!-- Sidebar content -->
          <div v-if="currentRound" class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="rounded-lg border-1 border-grey-lighter mb-4">
              <n-select
                v-model:value="selectedRound"
                :show-checkmark="false"
                :clearable="false"
                size="large"
                :theme-overrides="{
                  peers: {
                    InternalSelection: {
                      color: 'transparent',
                      textColor: 'white',
                    },
                    InternalSelectMenu: {
                      color: '#292929',
                    },
                  },
                }"
                :render-label="
                  (option: any) => {
                    return h('div', { class: 'flex items-center w-full' }, [
                      h('div', { class: 'font-bold text-white text-[16px] leading-[24px] p-2' }, option.label),
                      h(
                        'div',
                        {
                          class: `w-[7px] h-[7px]  rounded-full ml-auto absolute right-5 ${option.status === ProposalRoundStatus.ACTIVE ? 'bg-statusGreen animate-pulse' : 'bg-statusRed'} `,
                        },
                        ''
                      ),
                    ]);
                  }
                "
                :render-tag="
                  ({ option }) => {
                    return h('div', { class: 'flex items-center' }, [
                      h('span', { class: 'font-bold text-white text-[16px] leading-[24px]' }, `Round #${option.value}`),
                    ]);
                  }
                "
                :options="
                  proposalRounds.map(p => {
                    return {
                      label: `Round #${p.id}`,
                      status: p.roundStatus,
                      value: p.id,
                    };
                  })
                "
                class="font-bold"
              >
                <template #arrow>
                  <div class="flex items-center mr-4">
                    <div
                      v-if="currentRound?.roundStatus === ProposalRoundStatus.ACTIVE"
                      class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse mr-2"
                    ></div>
                    <div v-else class="w-[7px] h-[7px] bg-statusRed rounded-full mr-2"></div>

                    <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc text-primary" />
                  </div>
                </template>
              </n-select>
            </div>

            <div class="font-medium text-[14px] leading-[20px] text-grey-lightest">
              <div
                class="flex items-center py-4 border-b-1 border-b-grey-lighter"
                :title="dateTimeToDateAndTime(currentRound.startTime)"
              >
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/calendar" />
                <div>Started on:</div>
                <div class="ml-auto text-white/80 font-bold">{{ toMonthAndYear(currentRound.startTime) }}</div>
              </div>

              <div
                class="flex items-center py-4 border-b-1 border-b-grey-lighter"
                :title="dateTimeToDateAndTime(currentRound.endTime)"
              >
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/flag" />
                <div>Ends on:</div>
                <div class="ml-auto text-white/80 font-bold">{{ toMonthAndYear(currentRound.endTime) }}</div>
              </div>

              <div class="flex items-center py-4" :title="dateTimeToDateAndTime(new Date())">
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/trophy" />
                <div>Reward:</div>
                <div class="flex items-center justify-center text-white/80 ml-auto font-bold">
                  <div class="mr-1">{{ currentRound.rewardPoints }}</div>
                  <NuxtIcon name="icon/star2" class="text-primary" />
                </div>
              </div>

              <BasicButton
                v-if="currentRound.roundStatus === ProposalRoundStatus.ACTIVE"
                class="w-full mt-4"
                :btn-class="['!font-bold']"
                :size="'large'"
                :disabled="!isConnected || !userStore.loggedIn"
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
import { formatDistanceToNow } from 'date-fns';
import { h } from 'vue';
import {
  ProposalRoundStatus,
  ProposalVoteType,
  type Proposal,
  type ProposalRound,
  type ProposalRoundsResponse,
  type ProposalsResponse,
  type ProposalVoteResponse,
} from '~/lib/types/proposal';
import Endpoints from '~/lib/values/endpoints';

enum Sort {
  TOP = 1,
  NEW = 2,
}

const { isConnected } = useAccount();
const router = useRouter();
const userStore = useUserStore();
const message = useMessage();

const search = ref('');
const sortFilter = ref(Sort.TOP);

const selectedRound = ref<string | number>();
const currentRound = ref<ProposalRound>();
const proposalRounds = ref<ProposalRound[]>([]);
const proposals = ref<Proposal[]>([]);

const loading = ref(false);
const loadingProposals = ref(false);
const loadingVote = ref(false);

onMounted(() => {
  getProposalRounds();
});

watch(selectedRound, newValue => {
  if (newValue) {
    const round = proposalRounds.value.find(p => p.id === newValue);
    if (round) {
      currentRound.value = round;
    }
  }
});

watchDebounced(
  () => currentRound.value,
  async () => {
    if (currentRound.value) {
      await getProposals();
    }
  },
  { debounce: 500, maxWait: 1000 }
);

async function getProposals() {
  if (!currentRound?.value?.id) {
    return;
  }

  loadingProposals.value = true;
  try {
    const res = await $api.get<ProposalsResponse>(Endpoints.proposals, {
      roundId: currentRound.value.id,
    });

    proposals.value = res.data.items;
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loadingProposals.value = false;
  }
}

async function vote(proposalId: number, voteType: ProposalVoteType, idx: number) {
  if (!currentRound?.value?.id) {
    return;
  }

  const totalVotes = proposals.value[idx].totalVotes;
  const existingVote = proposals.value[idx].votes.find(v => v.user_id === userStore.user.id);
  if (existingVote) {
    if (existingVote.voteType === voteType) {
      proposals.value[idx].totalVotes += voteType === ProposalVoteType.UPVOTE ? -1 : 1;
    }
  } else {
    proposals.value[idx].totalVotes += voteType === ProposalVoteType.UPVOTE ? 1 : -1;
  }

  loadingVote.value = true;
  try {
    await $api.post<ProposalVoteResponse>(Endpoints.voteOnProposal(proposalId), {
      voteType,
    });

    const res = await $api.get<ProposalsResponse>(Endpoints.proposals, {
      roundId: currentRound.value.id,
      proposalId,
    });

    proposals.value[idx] = res.data.items[0];
  } catch (error) {
    message.error(apiError(error));

    proposals.value[idx].totalVotes = totalVotes;
  } finally {
    loadingVote.value = false;
  }
}

async function getProposalRounds() {
  loading.value = true;

  try {
    const res = await $api.get<ProposalRoundsResponse>(Endpoints.proposalRounds, {
      orderBy: ['id'],
      desc: [true],
    });

    proposalRounds.value = res.data.items;
    if (proposalRounds.value.length) {
      selectedRound.value = proposalRounds.value[0].id;
      currentRound.value = proposalRounds.value[0];
    }
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}

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
