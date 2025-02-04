export enum WormholeMessageReceived {
  LOAN_CRATE_STARTED = 1,
  LOAN_CRATED = 2,
  REPAYMENT_STARTED = 3,
  REPAYMENT_COMPLETED = 4,
  DEFAULT_STARTED = 5,
  DEFAULT_COMPLETED = 6,
}

export type ContractEvent = {
  block: number;
  address: string;
  event: string;
  id: string;
  loanHash: string;
  timestamp: string;
  type: string;
  data: {
    loanHash: string;
    messageType?: number;
  };
};
export type ContractEventItems = Record<string, ContractEvent[]>;
export type ContractEventResponse = { contractEvents: ContractEvent[] };
