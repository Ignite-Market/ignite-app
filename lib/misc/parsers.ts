import type { Address } from 'viem';
import type { AssetInterface, AssetMetadata } from '../types/asset';
import type {
  AnyOffer,
  AnyOfferRequest,
  CsvNftData,
  OfferClaimData,
  OfferInterface,
  OfferListInterface,
  OfferRequestInterface,
  OfferRequestListInterface,
} from '../types/offer';
import type { HexString } from '@openzeppelin/merkle-tree/dist/bytes';

export function parseAssetFromOffer(offer: AnyOfferRequest | AnyOffer): AssetInterface {
  const o1 = offer as OfferInterface | OfferRequestInterface;
  if (o1?.asset) {
    return o1.asset;
  }

  const o = offer as OfferListInterface | OfferRequestListInterface;
  return {
    id: o.asset_id,
    status: o.asset__status,
    createTime: o.asset__createTime,
    updateTime: o.asset__updateTime,
    chainId: o.asset__chainId,
    contractAddress: o.asset__contractAddress,
    tokenId: o.asset__tokenId,
    ownerAddress: o.asset__ownerAddress,
    tokenURI: o.asset__tokenURI,
    contractName: o.asset__contractName,
    contractSymbol: o.asset__contractSymbol,
    metadata: parseAssetMetadata(o.asset__metadata),
  };
}

export function parseAssetMetadata(metadata: string | AssetMetadata): AssetMetadata {
  return typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
}

/**
 * Parses an input value to a valid integer number.
 * @param input Numeric value.
 */
export function parseToInt(input: any) {
  const value = parseInt(input);

  if (isNaN(value) || !isFinite(value)) {
    throw new Error(`Invalid integer number ${value}`);
  }
  return value;
}

export function formatSeconds(sec: string) {
  let seconds = sec || 0;
  seconds = Number(seconds);
  seconds = Math.abs(seconds);

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [] as string[];

  if (d > 0) {
    parts.push(d + ' day' + (d > 1 ? 's' : ''));
  }

  if (h > 0) {
    parts.push(h + ' hour' + (h > 1 ? 's' : ''));
  }

  if (m > 0 && parts.length < 2) {
    parts.push(m + ' minute' + (m > 1 ? 's' : ''));
  }

  if (s > 0 && parts.length < 2) {
    parts.push(s + ' second' + (s > 1 ? 's' : ''));
  }

  return parts.join(', ');
}

/**
 * Parse CsvNft to ClaimData
 */
export const parseCsvNftToClaimData = (line: CsvNftData, lenderAddress: Address): OfferClaimData => {
  return {
    lender: lenderAddress,
    nftContract: line['NFT Contract'] as Address,
    nftId: Number(line['NFT ID']),
    offerExpiration: Number(line['Sale Expiration']),
    lendToken: line['Sale Contract'] as Address,
    lendAmount: numToBigInt(Number(line['Sale Amount'])),
    loanDuration: line['Term Until Collateral At Risk'],
    repayToken: line['Buy Back Contract'] as Address,
    repayAmount: numToBigInt(Number(line['Buy Back Amount'])),
  };
};

/**
 * Parse ClaimData to Offer
 */
export const parseClaimDataToOffer = async (
  claimData: OfferClaimData,
  chainId: number,
  borrowerAddress: Address,
  signature: string,
  merkleRoot: string,
  merkleProofs: HexString[]
) => {
  return {
    chainId: chainId,
    contractAddress: claimData.nftContract,
    tokenId: claimData.nftId,
    borrowerAddress,
    loanChainId: chainId,
    loanTokenContract: claimData.lendToken,
    interestRate: calcAnnualInterestRateWithSeconds(
      bigIntToNum(claimData.lendAmount),
      bigIntToNum(claimData.repayAmount),
      Number(claimData.loanDuration)
    ),

    loanAmount: claimData.lendAmount.toString(),
    loanDuration: claimData.loanDuration,
    lenderAddress: claimData.lender,
    offerExpiration: claimData.offerExpiration,
    repayAmount: claimData.repayAmount.toString(),
    repayChainId: chainId,
    repayTokenContract: claimData.repayToken,

    signature,
    merkleRoot,
    merkleProofs,
  };
};
