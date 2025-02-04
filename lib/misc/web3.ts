import { keccak256, encodePacked } from 'viem';
import type { OfferClaimData } from '../types/offer';

export function getCurrentTime() {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * Generates order hash from input data.
 *
 */
export function generateLoanHash(input: OfferClaimData): string {
  return keccak256(
    encodePacked(
      [
        'string',
        'address',
        'address',
        'uint256',
        'uint16',
        'uint256',
        'bool',
        'address',
        'uint256',
        'uint16',
        'uint32',
        'uint256',
        'uint256',
      ],
      [
        'com.lendeefi.offer',
        input.lender,
        input.nftContract,
        BigInt(input.nftId),
        Number(input.nftChainId),
        BigInt(input.offerExpiration),
        input.collectionOffer,
        input.lendToken,
        input.lendAmount,
        Number(input.lendChainId),
        Number(input.interestRate),
        BigInt(input.loanDuration),
        BigInt(Number(input.loanNonce)),
      ]
    )
  );
}
