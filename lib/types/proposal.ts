/**
 * Proposal round status.
 */
export enum ProposalRoundStatus {
  INITIALIZED = 1,
  ACTIVE = 2,
  FINISHED = 3,
}

/**
 * Proposal vote type.
 */
export enum ProposalVoteType {
  UPVOTE = 1,
  DOWNVOTE = -1,
}

/**
 * Proposal vote interface.
 */
export interface ProposalVote extends GeneralInterface {
  user_id: number;
  proposal_id: string;
  voteType: ProposalVoteType;
}
export interface ProposalVoteResponse extends GeneralResponse<ProposalVoteResponse> {}

/**
 * Proposal rounds interface.
 */
export interface Proposal extends GeneralInterface {
  round_id: number;
  user_id: number;
  question: string;
  generalResolutionDef: string;
  outcomeResolutionDef: string;
  totalVotes: number;
  username: string;
  userWallet: string;
  votes: ProposalVote[];
}
export interface ProposalResponse extends GeneralResponse<Proposal> {}
export interface ProposalsResponse extends GeneralItemsResponse<Proposal> {}

/**
 * Proposal rounds interface.
 */
export interface ProposalRound extends GeneralInterface {
  rewardPoints: number;
  startTime: Date;
  endTime: Date;
  roundStatus: ProposalRoundStatus;
  winner_id?: number;
  winner?: {
    id: number;
    createTime: Date;
    user_id: number;
    question: string;
    username: string;
    userWallet: string;
  };
}
export interface ProposalRoundResponse extends GeneralResponse<ProposalRound> {}
export interface ProposalRoundsResponse extends GeneralItemsResponse<ProposalRound> {}
