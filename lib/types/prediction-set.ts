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
 * Prediction set transaction type.
 */
export enum TransactionType {
  BUY = 1,
  SELL = 2,
  FUND = 3,
}
