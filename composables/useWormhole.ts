import { moonbaseAlpha, moonbeam } from 'viem/chains';
import { chainToWormholeId, ContractType, getWormholeConfigForChain } from '~/lib/config/contracts';
import { AppEnv } from '~/lib/types/config';

export default function useWormhole() {
  const config = useRuntimeConfig();
  const { getReadContract } = useContracts();

  /**
   * Read actions
   */
  async function cost(relayerChainId: number, toChainId: number, receiverValue: number = 0, gasLimit = 900000n) {
    const wormholeConfig = getWormholeConfigForChain(relayerChainId);
    const contract = await getReadContract(ContractType.WORMHOLE, relayerChainId, wormholeConfig.wormholeRelayer);

    const [nativePriceQuote, targetChainRefundPerGasUnused] = await contract.read.quoteEVMDeliveryPrice([
      chainToWormholeId(toChainId),
      receiverValue,
      gasLimit,
    ]);
    return nativePriceQuote;
  }

  /**
   * Write actions
   */

  /**
   * Helpers
   */
  /** spoke -> hub -> spoke */
  async function calcHubToSpokeCosts(fromChainId: number, toChainId: number): Promise<number[]> {
    const cost1 = await cost(toChainId, fromChainId);
    const cost2 = await cost(fromChainId, toChainId, cost1);

    return [cost1, cost2];
  }

  /** spoke1 -> hub -> spoke2 -> hub -> spoke1 */
  async function calcSpokeToSpokeCosts(fromChainId: number, toChainId: number): Promise<number[]> {
    const hubChainId = config.public.ENV === AppEnv.PROD ? moonbeam.id : moonbaseAlpha.id;

    const cost1 = await cost(hubChainId, fromChainId);
    const cost2 = await cost(toChainId, hubChainId, cost1);
    const cost3 = await cost(hubChainId, toChainId, cost2);
    const cost4 = await cost(fromChainId, hubChainId, cost3);

    return [cost1, cost2, cost3, cost4];
  }

  async function calcCosts(fromChainId: number, toChainId: number) {
    if (fromChainId === toChainId) return [];

    const hubChainId = config.public.ENV === AppEnv.PROD ? moonbeam.id : moonbaseAlpha.id;

    return fromChainId === hubChainId || toChainId === hubChainId
      ? await calcHubToSpokeCosts(fromChainId, toChainId)
      : await calcSpokeToSpokeCosts(fromChainId, toChainId);
  }

  return {
    cost,
    calcCosts,
    calcHubToSpokeCosts,
    calcSpokeToSpokeCosts,
  };
}
