<template>
  <Dashboard :loading="loading">
    <div class="px-4 max-w-[1241px] m-auto">
      <!-- CONTENT -->
      <div class="flex flex-col-reverse md:flex-row justify-center">
        <!-- LEFT -->
        <div class="flex flex-col min-w-[250px] max-w-[736px] pt-2">
          <!-- Main forum content goes here -->
          <div v-if="proposal" class="border-1 border-grey-lighter rounded-lg overflow-hidden">
            <!-- Voting sidebar -->
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
                  :disabled="!isConnected || !userStore.loggedIn || loadingVote"
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
                  :disabled="!isConnected || !userStore.loggedIn || loadingVote"
                  @click="vote(ProposalVoteType.DOWNVOTE)"
                >
                  <NuxtIcon name="icon/arrow-down" class="text-[30px]" />
                </Btn>
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
                    <div class="bg-grey-lighter px-2 py-0.5 rounded-full text-xs ml-1">Crypto</div>
                  </div>
                </div>

                <!-- Post content -->
                <div class="p-3 pr-5">
                  <div class="text-white font-medium text-[20px] mb-2 line-clamp-3">
                    {{ proposal.question }}
                  </div>
                  <div class="text-white/80 text-[14px]">
                    {{ proposal.generalResolutionDef }}
                  </div>
                </div>

                <!-- Post footer/actions -->
                <div class="p-3 pb-5 flex items-center text-white/60 text-xs">
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

          <CommentListing v-if="proposal" :entity-id="proposal.id" :entity-type="CommentEntityTypes.PROPOSAL" />
        </div>

        <!-- RIGHT -->
        <div class="md:sticky top-6 self-start md:ml-8 lg:ml-24 w-full min-w-[260px] md:w-[409px]">
          <!-- Sidebar content -->
          <div v-if="round" class="border-1 border-grey-lighter rounded-lg p-6">
            <div class="rounded-lg border-1 border-grey-lighter mb-4 flex items-center justify-center py-3 px-4">
              <div class="font-bold text-white text-[16px] leading-[24px]">Round #{{ round.id }}</div>
              <div class="ml-auto">
                <div
                  v-if="round?.roundStatus === ProposalRoundStatus.ACTIVE"
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
                  <NuxtIcon name="icon/star2" class="text-primary" />
                </div>
              </div>

              <BasicButton
                v-if="round.roundStatus === ProposalRoundStatus.ACTIVE"
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
import {
  ProposalRoundStatus,
  ProposalVoteType,
  type Proposal,
  type ProposalRound,
  type ProposalRoundResponse,
  type ProposalsResponse,
  type ProposalVoteResponse,
} from '~/lib/types/proposal';
import Endpoints from '~/lib/values/endpoints';
import { CommentEntityTypes } from '~/lib/types/comment';

const { isConnected } = useAccount();
const router = useRouter();
const userStore = useUserStore();
const message = useMessage();
const { params } = useRoute();

const round = ref<ProposalRound>();
const proposal = ref<Proposal>();

const loading = ref(false);
const loadingVote = ref(false);

onMounted(async () => {
  await sleep(10);
  await getProposal();
});

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
        const resRound = await $api.get<ProposalRoundResponse>(Endpoints.proposalRoundById(proposal.value.round_id));
        round.value = resRound.data;
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
