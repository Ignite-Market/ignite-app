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
  REMOVE_FUND = 4,
  CLAIM = 5,
}

/**
 * Prediction set categories.
 */
export enum PredictionSetCategory {
  ALL = 'All',
  SPORTS = 'Sports',
  BUSINESS = 'Business',
}

export interface OutcomeChance extends GeneralInterface {
  chance: number;
  supply: number;
  totalSupply: number;
}

export interface OutcomeInterface extends GeneralInterface {
  outcomeIndex: number;
  positionId: string;
  name: string;
  latestChance: number;
  volume: number;
  imgUrl: string;
}

export interface ChainDataInterface extends GeneralInterface {
  questionId: string;
  conditionId: string;
  txHash: string;
  contractAddress: Address;
  lastProcessedBlock: number;
  parseBlockSize: number;
}

export interface PredictionSetInterface extends GeneralInterface {
  winner_outcome_id: number;
  collateral_token_id: number;
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
  imgUrl: string;
  outcomes: OutcomeInterface[];
  chainData: ChainDataInterface;
  isWatched?: boolean;
  fundingVolume?: number;
  transactionsVolume?: number;
  positions?: any[];
  fundingPositions?: number;
}
export interface PredictionSetResponse extends GeneralResponse<PredictionSetInterface> {}
export interface PredictionSetsResponse extends GeneralItemsResponse<any> {}

export interface PredictionSetOutcomeChanceInterface {
  [outcomeId: number]: {
    outcomeId: number;
    chance: number;
    date: Date;
  }[];
}

export interface PredictionSetChanceHistoryResponse extends GeneralResponse<PredictionSetOutcomeChanceInterface> {}

/**
 * Activity.
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
  outcomeId: number;
  outcomeName: string;
  boughtAmount: number;
  soldAmount: number;
  claimedAmount: number;
  outcomeTokens: number;
  collateral_token_id: number;
}
export interface UserPredictionsResponse extends GeneralItemsResponse<UserPredictionInterface> {}

/**
 * User funding positions.
 */
export interface UserFundingPositionInterface extends PredictionSetInterface {
  fundedAmount: number;
  removedAmount: number;
}
export interface UserFundingPositionsResponse extends GeneralItemsResponse<UserFundingPositionInterface> {}

/**
 * Collateral token.
 */
export interface CollateralTokenInterface extends GeneralInterface {
  name: string;
  symbol: string;
  address: Address;
  decimals: number;
  fundingThreshold?: string;
  imgUrl?: string;
  requiredVotingAmount?: string;
}
export interface CollateralTokensResponse extends GeneralItemsResponse<CollateralTokensResponse> {}
