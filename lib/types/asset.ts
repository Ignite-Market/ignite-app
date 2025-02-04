import type { Address } from 'viem';
import { moonbeam, moonbaseAlpha, base, baseSepolia, bsc, bscTestnet, mainnet, sepolia } from '@wagmi/vue/chains';

/** NFT Chains */
export enum Chains {
  ETHEREUM = mainnet.id,
  ETHEREUM_SEPOLIA = sepolia.id,
  BASE = base.id,
  BASE_SEPOLIA = baseSepolia.id,
  BSC = bsc.id,
  BSC_TESTNET = bscTestnet.id,
  MOONBASE = moonbaseAlpha.id,
  MOONBEAM = moonbeam.id,
}

export interface AssetMetadata extends Record<string, any> {
  name: string;
  image: string;
  attributes: any[];
  description: string;
}

export type NFT = AssetMetadata & {
  id: number;
  approved?: string;
  chainId: number;
  contractAddress: Address;
  uri: string;
};

export interface AssetInterface extends GeneralInterface {
  chainId: number;
  tokenId: number;
  contractAddress: Address;
  contractName: string;
  contractSymbol: string;
  tokenURI: string;
  ownerAddress: string;
  metadata: string | AssetMetadata;
}

export interface AssetResponse extends GeneralResponse<AssetInterface> {}
export interface AssetsResponse extends GeneralItemsResponse<AssetInterface> {}

export type MoralisNFT = {
  token_address: Address; // Address of the token contract
  token_id: string; // Unique identifier for the NFT
  contract_type: 'ERC721' | 'ERC1155'; // Type of the NFT contract
  owner_of: string; // Address of the current owner
  block_number: string; // Block number where this NFT was last updated
  block_number_minted: string; // Block number where this NFT was minted
  token_uri: string; // URI pointing to the token metadata
  metadata: string; // Raw metadata of the NFT
  normalized_metadata: string; // Processed metadata
  media: string; // Media content associated with the NFT
  amount: string; // Amount of tokens, typically "1" for NFTs
  name: string; // Name of the NFT or collection
  symbol: string; // Symbol of the NFT or collection
  token_hash: string; // Unique hash for the token
  rarity_rank: number; // Rank indicating rarity
  rarity_label: string; // Label describing rarity
  rarity_percentage: number; // Percentage describing rarity
  last_token_uri_sync: string; // Timestamp of last sync for token URI
  last_metadata_sync: string; // Timestamp of last sync for metadata
  possible_spam: boolean; // Indicates if this is possibly spam
  verified_collection: boolean; // Indicates if the collection is verified
};
export interface MoralisNftsResponse extends MoralisResponse<MoralisNFT[]> {}
