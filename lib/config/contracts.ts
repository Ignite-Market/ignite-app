import { CONDITIONAL_TOKEN_ABI, FPMM_ABI } from './abi';

/**
 * Contract types.
 */
export enum ContractType {
  COLLATERAL_TOKEN = 1,
  CONDITIONAL_TOKEN = 2,
  FPMM_FACTORY = 3,
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
    default:
      return null;
  }
}
