import { decodeEventLog, keccak256, parseAbiItem, toHex } from 'viem';
import { flareTestnet, songbird } from 'viem/chains';

/**
 *  Parses ERC1155 TransferSingle events from transaction receipt.
 *
 * @param txReceipt Transaction receipt.
 * @returns TransferSingle events.
 */
export function parseSingleTransfersERC1155(txReceipt: any) {
  const singleTransferEventSignature = 'TransferSingle(address,address,address,uint256,uint256)';
  const singleTransferEventAbi =
    'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)';

  try {
    const topicHash = keccak256(toHex(singleTransferEventSignature));

    return txReceipt.data.logs
      .filter((log: any) => log.topics[0] === topicHash)
      .map((log: any) => {
        const parsed = decodeEventLog({
          abi: [parseAbiItem(singleTransferEventAbi)],
          data: log.data,
          topics: log.topics,
        });

        return {
          contractAddress: log.address,
          operator: parsed.args.operator,
          from: parsed.args.from,
          to: parsed.args.to,
          tokenId: parsed.args.id,
          amount: parsed.args.value,
          logIndex: log.logIndex,
        };
      });
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Parses ERC20 Transfer events from transaction receipt.
 *
 * @param txReceipt Transaction receipt.
 * @returns Transfer events.
 */
export function parseTransfersERC20(txReceipt: any) {
  const transferEventSignature = 'Transfer(address,address,uint256)';
  const transferEventAbi = 'event Transfer(address indexed from, address indexed to, uint256 value)';

  try {
    const topicHash = keccak256(toHex(transferEventSignature));

    return txReceipt.data.logs
      .filter((log: any) => log.topics[0] === topicHash)
      .map((log: any) => {
        const parsed = decodeEventLog({
          abi: [parseAbiItem(transferEventAbi)],
          data: log.data,
          topics: log.topics,
        });

        return {
          contractAddress: log.address,
          from: parsed.args.from,
          to: parsed.args.to,
          amount: parsed.args.value,
          logIndex: log.logIndex,
        };
      });
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Gets explorer URL base on the selected network.
 *
 * @returns Explorer URL.
 */
export function getExplorer() {
  const config = useRuntimeConfig();
  return ['local', 'development', 'staging'].includes(config.public.ENV)
    ? flareTestnet.blockExplorers.default.url
    : songbird.blockExplorers.default.url;
}
