/**
 * Proposal round status.
 */
export enum ProposalRoundStatus {
  INITIALIZED = 1,
  ACTIVE = 2,
  FINISHED = 3,
}

/**
 * Proposal rounds interface.
 */
export interface Proposal extends GeneralInterface {}
export interface ProposalsResponse extends GeneralItemsResponse<Proposal> {}

/**
 * Proposal rounds interface.
 */
export interface ProposalRound extends GeneralInterface {
  rewardPoints: number;
  startTime: Date;
  endTime: Date;
  roundStatus: ProposalRoundStatus;
}
export interface ProposalRoundsResponse extends GeneralItemsResponse<ProposalRound> {}
