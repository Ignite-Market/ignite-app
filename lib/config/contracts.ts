import type { Address } from 'viem';
import { abiLendeeFi, abiNftCollection, abiToken, abiWormhole } from './abi';
import { Chains } from '../types/asset';

export enum ContractType {
  LENDEEFI = 'lendeeFi',
  NFT = 'nft',
  TOKEN = 'token',
  WORMHOLE = 'wormhole',
}

export type WormholeConfig = {
  url: string;
  chainId: number;
  wormholeRelayer: Address;
  wormholeChainId: number;
};

export const wormholeConfig: Record<string, WormholeConfig> = {
  baseSepolia: {
    url: 'https://sepolia.base.org',
    chainId: 84532,
    wormholeRelayer: '0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE',
    wormholeChainId: 10004,
  },
  moonbaseAlpha: {
    url: 'https://moonbase-rpc.dwellir.com',
    chainId: 1287,
    wormholeRelayer: '0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0',
    wormholeChainId: 16,
  },
  bscTestnet: {
    url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainId: 97,
    wormholeRelayer: '0x80aC94316391752A193C1c47E27D382b507c93F3',
    wormholeChainId: 4,
  },
};

export function chainToWormholeId(chainId: number) {
  switch (chainId) {
    case Chains.BASE_SEPOLIA: {
      return wormholeConfig.baseSepolia.wormholeChainId;
    }
    case Chains.MOONBASE: {
      return wormholeConfig.moonbaseAlpha.wormholeChainId;
    }
    case Chains.BSC_TESTNET: {
      return wormholeConfig.bscTestnet.wormholeChainId;
    }
    case Chains.ETHEREUM_SEPOLIA: {
      return 10002;
    }
    default: {
      throw new Error('unsupported chain');
    }
  }
}

export const getWormholeConfigForChain = (chainId: number): WormholeConfig => {
  return Object.values(wormholeConfig).find(config => config.chainId === chainId) || wormholeConfig.bscTestnet;
};
export const parseWormholeChainId = (wormholeChainId: number): number => {
  return (
    Object.values(wormholeConfig).find(config => config.wormholeChainId === wormholeChainId)?.chainId || wormholeChainId
  );
};

export function getContractAbi(contractType: ContractType) {
  switch (contractType) {
    case ContractType.LENDEEFI:
      return abiLendeeFi;
    case ContractType.NFT:
      return abiNftCollection;
    case ContractType.TOKEN:
      return abiToken;
    case ContractType.WORMHOLE:
      return abiWormhole;
    default:
      return abiToken;
  }
}
