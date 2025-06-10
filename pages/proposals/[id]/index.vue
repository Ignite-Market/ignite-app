<template>
  <Dashboard :loading="loading">
    <div class="px-4 max-w-[1241px] m-auto mb-16">
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <!-- LEFT -->
        <div class="flex flex-col min-w-[250px] max-w-[736px] pt-2 relative w-full">
          <Btn
            class="left-[-72px] absolute"
            btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
            type="link"
            @click="router.back()"
          >
            <NuxtIcon name="icon/arrow-back" class="text-[24px]" />
          </Btn>

          <div v-if="proposal" class="border-1 border-grey-lighter rounded-lg overflow-hidden w-full">
            <div class="flex">
              <div class="bg-grey-dark py-5 pr-0 flex flex-col items-center w-16">
                <Btn
                  btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter rotate-180 mt-1"
                  :class="{
                    '!bg-grey-lighter !text-primary': proposal.votes.find(
                      v => v.user_id === userStore?.user?.id && v.voteType === ProposalVoteType.UPVOTE
                    ),
                  }"
                  type="link"
                  :disabled="
                    !loggedIn ||
                    loadingVote ||
                    proposal.user_id === userStore.user.id ||
                    !isProposalRoundActive(round) ||
                    !hasRequiredTokens
                  "
                  @click="vote(ProposalVoteType.UPVOTE)"
                >
                  <NuxtIcon name="icon/arrow-down" class="text-[30px]" />
                </Btn>

                <div class="text-white font-bold py-2 text-[20px]">
                  {{ proposal.totalVotes }}
                </div>

                <Btn
                  btn-class="bg-grey-light h-8 w-8 rounded flex-cc hover:bg-grey-lighter"
                  :class="{
                    '!bg-grey-lighter !text-primary': proposal.votes.find(
                      v => v.user_id === userStore?.user?.id && v.voteType === ProposalVoteType.DOWNVOTE
                    ),
                  }"
                  type="link"
                  :disabled="
                    !loggedIn ||
                    loadingVote ||
                    proposal.user_id === userStore.user.id ||
                    !isProposalRoundActive(round) ||
                    !hasRequiredTokens
                  "
                  @click="vote(ProposalVoteType.DOWNVOTE)"
                >
                  <NuxtIcon name="icon/arrow-down" class="text-[30px]" />
                </Btn>

                <div
                  v-if="proposal.id === round?.winner?.id"
                  class="w-[40px] h-[40px] bg-primary/20 rounded-full flex items-center justify-center mt-4"
                >
                  <NuxtIcon name="icon/trophy" class="text-[22px] text-primary" />
                </div>
              </div>

              <div class="flex-1">
                <!-- Post header -->
                <div class="p-3 pt-5 bg-grey-light/10">
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
                      <span class="cursor-pointer hover:text-primary-bright" @click="openUserProfile(proposal.user_id)">
                        {{ proposal.username }}
                      </span>
                    </div>
                    <div class="mx-2 border-r-1 border-r-white/25 h-[12px]"></div>
                    <div class="mr-2" :title="dateTimeToDateAndTime(proposal.createTime)">
                      {{ formatDistanceToNow(new Date(proposal.createTime), { addSuffix: true }) }}
                    </div>
                    <!-- TODO: tags? -->
                    <div class="bg-grey-lighter px-2 py-0.5 rounded-full text-xs ml-1">Crypto</div>

                    <div v-if="loggedIn" class="ml-auto">
                      <ProposalOptions :proposal="proposal" :round="round" @delete="() => router.push('/proposals')" />
                    </div>
                  </div>
                </div>

                <!-- Post content -->
                <div class="p-3 pr-5">
                  <div class="text-white font-medium text-[20px] mb-2 line-clamp-3">
                    {{ proposal.question }}
                  </div>
                  <div class="text-white/80 text-[14px] mb-5">
                    {{ proposal.generalResolutionDef }}
                  </div>
                  <div v-if="proposal.outcomes && proposal.outcomes.length">
                    <div class="text-white text-[14px] font-medium mb-2">Possible outcomes:</div>
                    <ul class="list-disc pl-5 mb-1">
                      <li
                        v-for="(outcome, index) in proposal.outcomes"
                        :key="index"
                        class="text-white/90 text-[14px] mb-1"
                      >
                        {{ outcome }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Post footer/actions -->
                <div class="p-3 pb-5 flex items-center text-white/60 text-xs">
                  <div
                    class="flex items-center justify-center bg-grey-light hover:bg-grey-lighter p-1.5 rounded cursor-pointer group"
                    @click="copyLink"
                  >
                    <NuxtIcon name="icon/share" class="mr-1 text-[16px] group-hover:text-primary" />
                    <span>Share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CommentListing v-if="proposal" :entity-id="proposal.id" :entity-type="CommentEntityTypes.PROPOSAL" />
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px]">
          <div v-if="round" class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="rounded-lg border-1 border-grey-lighter mb-4 flex items-center justify-center py-3 px-4">
              <div class="font-bold text-white text-[16px] leading-[24px]">Round #{{ round.id }}</div>
              <div class="ml-auto">
                <div
                  v-if="isProposalRoundActive(round)"
                  class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse mr-2"
                ></div>
                <div v-else class="w-[7px] h-[7px] bg-statusRed rounded-full mr-2"></div>
              </div>
            </div>

            <div class="font-medium text-[14px] leading-[20px] text-grey-lightest">
              <div
                class="flex items-center py-4 border-b-1 border-b-grey-lighter"
                :title="dateTimeToDateAndTime(round.startTime)"
              >
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/calendar" />
                <div>Started on:</div>
                <div class="ml-auto text-white/80 font-bold">{{ toMonthAndYear(round.startTime) }}</div>
              </div>

              <div
                class="flex items-center py-4 border-b-1 border-b-grey-lighter"
                :title="dateTimeToDateAndTime(round.endTime)"
              >
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/flag" />
                <div>Ends on:</div>
                <div class="ml-auto text-white/80 font-bold">{{ toMonthAndYear(round.endTime) }}</div>
              </div>

              <div class="flex items-center py-4" :title="dateTimeToDateAndTime(new Date())">
                <NuxtIcon class="text-grey-lightest text-[17px] mr-[17px]" name="icon/trophy" />
                <div>Reward:</div>
                <div class="flex items-center justify-center text-white/80 ml-auto font-bold">
                  <div class="mr-1">{{ round.rewardPoints }}</div>
                  <NuxtIcon name="icon/points" class="text-primary" />
                </div>
              </div>

              <BasicButton
                v-if="isProposalRoundActive(round)"
                class="w-full mt-4"
                :btn-class="['!font-bold']"
                :size="'large'"
                :disabled="!loggedIn"
                :loading="loading"
                @click="router.push('/proposals/add')"
              >
                Add proposal
              </BasicButton>

              <div v-else-if="round.winner_id && round.winner" class="mt-4">
                <div class="text-white/80 text-[14px] mb-2">This round has finished:</div>
                <div
                  class="border-1 border-grey-lighter rounded-lg p-4 hover:border-primary cursor-pointer"
                  @click="
                    router.push({
                      name: 'proposals-id',
                      params: { id: round.winner.id },
                    })
                  "
                >
                  <div class="flex items-center mb-2">
                    <NuxtIcon name="icon/trophy" class="text-primary text-[20px] mr-2" />
                    <div class="font-bold text-white">Winner</div>
                  </div>
                  <div class="text-white/80 text-[14px] mb-2">{{ round.winner.question }}</div>
                  <div class="flex items-center text-white/60 text-[12px]">
                    <div class="w-4 h-4 rounded-full overflow-hidden mr-1">
                      <jazzicon
                        class="rounded-[50%] w-[16px] h-[16px] flex-shrink-0"
                        :address="round.winner.userWallet"
                        :diameter="16"
                      />
                    </div>
                    <span
                      class="hover:text-primary-bright cursor-pointer"
                      @click="openUserProfile(round.winner.user_id)"
                    >
                      {{ round.winner.username }}
                    </span>
                    <div class="mx-2 border-r-1 border-r-white/25 h-[12px]"></div>
                    <div>{{ formatDistanceToNow(new Date(round.winner.createTime), { addSuffix: true }) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="isProposalRoundActive(round) && proposal && proposal.user_id !== userStore?.user?.id"
            class="border-1 border-grey-lighter rounded-lg p-6 mt-6"
          >
            <div class="font-bold text-[16px] leading-[24px] mb-4 text-white">Voting Requirements</div>
            <div class="text-white/80 text-[14px] mb-2">Hold at least the minimum amount of one of these tokens:</div>
            <div class="mb-2 text-white/80 text-[14px]">
              <div v-for="token in votingTokens" :key="token.id" class="flex items-center my-2">
                <div class="mr-2 text-sm">•</div>
                <div class="w-4 h-4 mr-1.5">
                  <img :src="token.imgUrl" class="w-full h-full object-contain" :alt="token.symbol" />
                </div>
                <div class="font-medium text-sm">
                  {{
                    token.requiredVotingAmount
                      ? formatCollateralAmount(token.requiredVotingAmount, token.decimals)
                      : '0'
                  }}
                  {{ token.symbol }}
                </div>
                <div v-if="loggedIn && userBalances[token.id]" class="ml-auto pl-3">
                  <NuxtIcon
                    v-if="userBalances[token.id].hasEnough"
                    name="icon/complete"
                    class="text-statusGreen text-[14px]"
                  />
                  <NuxtIcon v-else name="icon/no" class="text-statusRed text-[14px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import { formatDistanceToNow } from 'date-fns';
import { CommentEntityTypes } from '~/lib/types/comment';
import {
  ProposalVoteType,
  type Proposal,
  type ProposalRound,
  type ProposalRoundsResponse,
  type ProposalsResponse,
  type ProposalVoteResponse,
} from '~/lib/types/proposal';
import Endpoints from '~/lib/values/endpoints';
import { type CollateralTokenInterface } from '~/lib/types/prediction-set';
import { useTokensStore } from '~/stores/collateral-tokens';
import useCollateralToken from '~/composables/useCollateralToken';

const router = useRouter();
const userStore = useUserStore();
const message = useMessage();
const tokensStore = useTokensStore();
const { getCollateralBalance } = useCollateralToken();
const { params } = useRoute();
const { loggedIn } = useLoggedIn();

const round = ref<ProposalRound>();
const proposal = ref<Proposal>();
const votingTokens = ref<CollateralTokenInterface[]>([]);
const userBalances = ref<{ [id: number]: { balance: bigint; hasEnough: boolean } }>({});

const loading = ref(false);
const loadingVote = ref(false);

const hasRequiredTokens = computed(() => {
  if (!loggedIn.value || !votingTokens.value.length || Object.keys(userBalances.value).length === 0) {
    return false;
  }

  return Object.values(userBalances.value).some(balance => balance.hasEnough);
});

onMounted(async () => {
  await sleep(10);
  await getProposal();

  await tokensStore.ensureLoaded();
  votingTokens.value = Object.values(tokensStore.items).filter(
    token => !!token.requiredVotingAmount && token.requiredVotingAmount !== '0'
  );

  if (loggedIn.value) {
    checkUserTokenBalances();
  }
});

watch(
  () => loggedIn.value,
  newValue => {
    if (newValue) {
      checkUserTokenBalances();
    } else {
      userBalances.value = {};
    }
  }
);

async function getProposal(silent: boolean = false) {
  if (!silent) {
    loading.value = true;
  }

  try {
    const res = await $api.get<ProposalsResponse>(Endpoints.proposals, {
      proposalId: Number(params?.id),
    });

    if (res.data.items.length) {
      proposal.value = res.data.items[0];

      if (!round.value) {
        const resRound = await $api.get<ProposalRoundsResponse>(Endpoints.proposalRounds, {
          roundId: proposal.value.round_id,
        });

        if (resRound.data.items.length) {
          round.value = resRound.data.items[0];
        }
      }
    }
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}

async function vote(voteType: ProposalVoteType) {
  if (!proposal?.value?.id) {
    return;
  }

  if (!hasRequiredTokens.value) {
    message.error('You need to hold the required tokens to vote.');
    return;
  }

  const totalVotes = proposal.value.totalVotes;
  const existingVote = proposal.value.votes.find(v => v.user_id === userStore.user.id);
  if (existingVote) {
    if (existingVote.voteType === voteType) {
      proposal.value.totalVotes += voteType === ProposalVoteType.UPVOTE ? -1 : 1;
    }
  } else {
    proposal.value.totalVotes += voteType === ProposalVoteType.UPVOTE ? 1 : -1;
  }

  loadingVote.value = true;
  try {
    await $api.post<ProposalVoteResponse>(Endpoints.voteOnProposal(proposal.value.id), {
      voteType,
    });

    // TODO: Refresh proposal.

    await getProposal(true);
  } catch (error) {
    message.error(apiError(error));

    proposal.value.totalVotes = totalVotes;
  } finally {
    loadingVote.value = false;
  }
}

async function checkUserTokenBalances() {
  if (!loggedIn.value || !votingTokens.value.length) return;

  for (const token of votingTokens.value) {
    try {
      if (!token.requiredVotingAmount) continue;

      const balance = await getCollateralBalance(token.id);
      const requiredAmount = BigInt(token.requiredVotingAmount);

      userBalances.value[token.id] = {
        balance,
        hasEnough: balance >= requiredAmount,
      };
    } catch (error) {
      console.error(`Error checking balance for token ${token.symbol}:`, error);
    }
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

function copyLink() {
  copyToClipboard(window.location.href);
}
</script>
