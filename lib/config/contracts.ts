import {
  COLLATERAL_TOKEN_ABI,
  CONDITIONAL_TOKEN_ABI,
  FPMM_ABI,
  SPARK_DEX_QUOTER_ABI,
  SPARK_DEX_SWAP_ROUTER_ABI,
} from './abi';

/**
 * Oracle contract ABI (minimal - vote and hasVoted)
 */
export const ORACLE_ABI = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'questionId', type: 'bytes32' },
      { internalType: 'uint256', name: 'outcomeIdx', type: 'uint256' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: '', type: 'bytes32' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Contract types.
 */
export enum ContractType {
  CONDITIONAL_TOKEN = 1,
  COLLATERAL_TOKEN = 2,
  FPMM = 3,
  QUOTER = 4,
  SWAP_ROUTER = 5,
  ORACLE = 6,
}

/**
 * Gets contract ABI based on contract type.
 * @param contractType Contract type.
 * @returns Contract ABI.
 */
export function getContractAbi(contractType: ContractType): any {
  switch (contractType) {
    case ContractType.CONDITIONAL_TOKEN:
      return CONDITIONAL_TOKEN_ABI;

    case ContractType.COLLATERAL_TOKEN:
      return COLLATERAL_TOKEN_ABI;

    case ContractType.FPMM:
      return FPMM_ABI;

    case ContractType.QUOTER:
      return SPARK_DEX_QUOTER_ABI;

    case ContractType.SWAP_ROUTER:
      return SPARK_DEX_SWAP_ROUTER_ABI;

    case ContractType.ORACLE:
      return ORACLE_ABI;

    default:
      return null;
  }
}
