import type { Address } from 'viem';
import type { AssetInterface } from './asset';

export enum OfferStatus {
  DRAFT = 1,
  PUBLISHED = 2,
  PROCESSING = 3, // on chain
  LOAN_CREATED = 4, // on chain
  LOAN_REPAID = 6, // on chain
  LOAN_DEFAULTED = 7, // on chain
  ROOT_DEACTIVATED = 9, // on chain
  ARCHIVED = 99,
}

export type CsvNftData = {
  'NFT Contract': string;
  'NFT ID': string;
  'Sale Expiration': string;
  'Sale Contract': string;
  'Sale Amount': string;
  'Term Until Collateral At Risk': string;
  'Buy Back Contract': string;
  'Buy Back Amount': string;
};

export type OfferClaimData = {
  lender: Address;
  nftContract: Address;
  nftId: number;
  nftChainId: number;
  offerExpiration: number;
  collectionOffer: boolean;

  lendToken: Address;
  lendAmount: bigint;
  lendChainId: number;
  interestRate: bigint | number;

  loanDuration: string | number;
  loanNonce: BigInt | number;
};

export interface BaseOfferInterface extends GeneralInterface {
  asset_id: number;
  batch_id: number;
  borrowerAddress: string;
  interestRate: number;
  lenderAddress: Address;
  loanAmount: string;
  loanChainId: number;
  loanCreatedTime: string;
  loanDefaultedTime: string;
  loanDuration: number;
  loanExpirationTime: string;
  loanRepayedTime: string;
  loanTokenId: string;
  loanTokenContract: Address;
  loanHash: string;
  merkleRoot: string;
  merkleProofs: string | string[];
  nonce: number;
  offerExpiration: number;
  offerExpirationTime: string;
  signature: string;
}
export interface OfferInterface extends BaseOfferInterface {
  asset: AssetInterface;
}
export interface OfferListInterface extends BaseOfferInterface, Prefixed<AssetInterface, 'asset__'> {}
export interface OfferResponse extends GeneralResponse<OfferInterface> {}
export interface OffersResponse extends GeneralItemsResponse<OfferListInterface> {}
export type AnyOffer = OfferListInterface | OfferInterface;

export interface OfferBatchInterface extends GeneralInterface {
  offers: OfferInterface[];
  status: number;
}
export interface OfferBatchResponse extends GeneralResponse<OfferBatchInterface> {}
export interface OffersBatchResponse extends GeneralItemsResponse<OfferBatchInterface> {}

export interface BaseOfferRequestInterface extends GeneralInterface {
  asset_id: number;
  borrowerAddress: string;
  interestRate: number;
  loanAmount: string;
  loanChainId: number;
  loanDuration: number;
  loanTokenContract: Address;
}
export interface OfferRequestInterface extends BaseOfferRequestInterface {
  asset: AssetInterface;
}
export interface OfferRequestListInterface extends BaseOfferRequestInterface, Prefixed<AssetInterface, 'asset__'> {}
export interface OfferRequestResponse extends GeneralResponse<OfferRequestInterface> {}
export interface OfferRequestsResponse extends GeneralItemsResponse<OfferRequestListInterface> {}
export type AnyOfferRequest = OfferRequestListInterface | OfferRequestInterface;
