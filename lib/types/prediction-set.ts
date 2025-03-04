import type { Address } from 'viem';

/**
 * Prediction set status.
 */
export enum PredictionSetStatus {
  INITIALIZED = 1,
  PENDING = 2,
  FUNDING = 3,
  ACTIVE = 4,
  VOTING = 5,
  FINALIZED = 6,
  ERROR = 7,
}

/**
 * Prediction set resolution type.
 */
export enum ResolutionType {
  AUTOMATIC = 1,
  MANUAL = 2,
}

/**
 * Prediction set transaction type.
 */
export enum TransactionType {
  BUY = 1,
  SELL = 2,
  FUND = 3,
}

export interface PredictionSetResponse extends GeneralResponse<PredictionSetInterface> {}
export interface PredictionSetsResponse extends GeneralItemsResponse<any> {}

export interface PredictionSetInterface extends GeneralInterface {
  winner_outcome_id: number;
  setId: string;
  question: string;
  description: string;
  generalResolutionDef: string;
  outcomeResolutionDef: string;
  outcomePriceDef: string;
  startTime: Date;
  endTime: Date;
  resolutionTime: Date;
  resolutionType: ResolutionType;
  consensusThreshold: number;
  setStatus: PredictionSetStatus;
  outcomes: OutcomeInterface[];
  chainData: ChainDataInterface;
  isWatched?: boolean;
}

export interface OutcomeInterface extends GeneralInterface {
  outcomeIndex: number;
  positionId: string;
  name: string;
  latestChance: OutcomeChance;
}

export interface ChainDataInterface extends GeneralInterface {
  questionId: string;
  conditionId: string;
  txHash: string;
  contractAddress: Address;
  lastProcessedBlock: number;
  parseBlockSize: number;
}

export interface OutcomeChance extends GeneralInterface {
  chance: number;
  supply: number;
  totalSupply: number;
}

export interface CommentInterface extends GeneralInterface {
  user_id: number;
  prediction_set_id: number;
  parent_comment_id: number;
  content: string;
  username: string;
  walletAddress: string;
  reply_user_id: number;
  taggedUserUsername: string;
  replies: CommentInterface[];
}

export interface PredictionSetChanceHistoryResponse extends GeneralResponse<PredictionSetOutcomeChanceInterface> {}

export interface PredictionSetOutcomeChanceInterface {
  [outcomeId: number]: {
    outcomeId: number;
    chance: number;
    date: Date;
  }[];
}

/**
 * Activity
 */
export interface ActivityInterface extends Omit<PredictionSetInterface, 'outcomes'> {
  outcomeName: string;
  userAmount: number;
  type: TransactionType;
  outcomeTokens: number;
  txHash: string;
  transactionTime: Date;
  userId?: number;
  username?: string;
  userWallet?: string;
}
export interface ActivitiesResponse extends GeneralItemsResponse<ActivityInterface> {}

/**
 * User Prediction
 */
export interface UserPredictionInterface extends Omit<PredictionSetInterface, 'outcomes'> {
  userAmount: number;
  userId: number;
  username: string;
  userWallet: string;
  outcomeName: string;
  boughtAmount: number;
  soldAmount: number;
  outcomeTokens: number;
}
export interface UserPredictionsResponse extends GeneralItemsResponse<UserPredictionInterface> {}
