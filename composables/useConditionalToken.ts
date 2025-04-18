import { useAccount } from '@wagmi/vue';
import { type Address, zeroHash } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useConditionalToken() {
  const { initContract } = useContracts();
  const { address, isConnected } = useAccount();
  const txWait = useTxWait();
  const message = useMessage();
  const config = useRuntimeConfig();

  /**
   * Checks if conditional tokens are approved for all on given FPMM contract, and approves them if they are not.
   *
   * @param fpmmContractAddress FPMM contract address.
   * @returns Boolean.
   */
  async function checkConditionalApprove(fpmmContractAddress: Address): Promise<boolean> {
    if (!isConnected.value) {
      return false;
    }

    const contract = await initContract(ContractType.CONDITIONAL_TOKEN);
    try {
      const isApproved = await contract.read.isApprovedForAll([address.value, fpmmContractAddress]);
      if (!isApproved) {
        txWait.hash.value = await contract.write.setApprovalForAll([fpmmContractAddress, true]);
        const receipt = await txWait.wait();
        console.debug(receipt);
      }

      return true;
    } catch (e) {
      console.error(e);
      message.error(contractError(e));
      return false;
    }
  }

  /**
   * Gets balance of conditional tokens for give position ID.
   *
   * @param outcomePositionId Outcome position ID.
   * @returns Conditional tokens balance.
   */
  async function getConditionalBalance(outcomePositionId: string) {
    if (!isConnected.value) {
      return BigInt(0);
    }

    const contract = await initContract(ContractType.CONDITIONAL_TOKEN);
    return await contract.read.balanceOf([address.value, outcomePositionId]);
  }

  /**
   * Parses conditional token balance with the decimals of collateral token.
   *
   * @param balance Conditional tokens balance.
   * @param collateralDecimals Number of decimal places of collateral token.
   * @returns Parsed balance.
   */
  function parseConditionalBalance(balance: bigint, collateralDecimals: number) {
    const parsedBalance = Number(balance) / Math.pow(10, collateralDecimals);

    return parsedBalance.toFixed(collateralDecimals);
  }

  /**
   * Claims winnings.
   *
   * @param conditionId Condition ID.
   * @param winningIndex Winning index.
   * @returns Redeem positions transaction.
   */
  async function claim(conditionId: string, winningIndex: number) {
    if (!isConnected.value) {
      return;
    }
    const contract = await initContract(ContractType.CONDITIONAL_TOKEN);

    // Bit representation of the winning index.
    // For a condition with 3 outcomes, each outcome is associated with a specific bit (e.g. outcome 0 is bit 0, outcome 1 is bit 1, outcome 2 is bit 2). An index set is a number where the bits that are set (1) indicate which outcomes are included. For example:
    // - The number 1 (binary 001) represents a token for outcome 0.
    // - The number 2 (binary 010) represents a token for outcome 1.
    // - The number 3 (binary 011) represents a token that covers outcomes 0 and 1.
    const indexSet = 1 << winningIndex;

    return await contract.write.redeemPositions([
      config.public.COLLATERAL_TOKEN_CONTRACT,
      zeroHash,
      conditionId,
      [indexSet],
    ]);
  }

  return {
    checkConditionalApprove,
    getConditionalBalance,
    parseConditionalBalance,
    claim,
  };
}
