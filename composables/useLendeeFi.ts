import type { HexString } from '@openzeppelin/merkle-tree/dist/bytes';
import type { Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';
import type { OfferClaimData } from '~/lib/types/offer';

export default function useLendeeFi() {
  const { initContract, getContractAddressByChain } = useContracts();

  /**
   * Read actions
   */
  async function generateHash(claimHash) {
    const contract = await initContract(ContractType.LENDEEFI);

    return await contract.read.generateHash([claimHash]);
  }

  async function validateSignature(signer: Address, claim: string, signature: string) {
    const contract = await initContract(ContractType.LENDEEFI);

    return await contract.read.validateSignature([signer, claim, signature]);
  }

  /**
   * Write actions
   */
  async function createLoan(
    claimData: OfferClaimData,
    root: string,
    proofs: HexString[],
    signature: string,
    costs: number[] = []
  ) {
    const contract = await initContract(ContractType.LENDEEFI);
    console.debug(claimData, root, proofs, signature, costs);

    const value = costs.length > 0 ? costs[costs.length - 1] : undefined;
    console.log(value);

    return await contract.write.createLoan([claimData, root, proofs, signature, costs], { value });
  }

  async function defaultLoan(claimHash: string, costs: number[] = []) {
    const contract = await initContract(ContractType.LENDEEFI);
    console.debug(claimHash);

    const value = costs.length > 0 ? costs[costs.length - 1] : undefined;
    console.log(value);

    return await contract.write.defaultLoan([claimHash, costs], { value });
  }

  async function repayLoan(claimHash: string, costs: number[] = []) {
    const contract = await initContract(ContractType.LENDEEFI);
    const repayLoan = getContractAddressByChain(ContractType.TOKEN);
    console.debug(repayLoan, claimHash);

    const value = costs.length > 0 ? costs[costs.length - 1] : undefined;
    console.log(value);

    return await contract.write.repayLoan([claimHash, costs], { value });
  }

  return {
    validateSignature,
    createLoan,
    defaultLoan,
    generateHash,
    repayLoan,
  };
}
