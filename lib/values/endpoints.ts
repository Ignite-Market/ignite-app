import type { Address } from 'viem';

const Endpoints = {
  /** User */
  me: '/users/me',
  walletMessage: '/users/wallet-message',
  walletLogin: '/users/wallet-login',

  // NOT USED
  changeMail: '/users/change-email',
  changeMailRequest: '/users/change-email-request',
  notification: '/notification',

  /** Asset */
  asset: (id: string | number) => `/assets/${id}`,
  assetsByWallet: (address: string | Address) => `/assets/wallet/${address}`,
  assetsByWallet2: (address: string | Address) => `/assets/wallet/2/${address}`,
  assetByTokenId: (chainId: number, contractAddr: string, tokenId: number) =>
    `/assets/chains/${chainId}/contracts/${contractAddr}/tokens/${tokenId}`,

  /** Loan */
  loans: (id?: string | number) => (id ? `/loans/${id}` : '/loans'),
  loanBorrower: (address: string | number) => `/loans/borrower/${address}`,

  /** Offer */
  offers: (id?: string | number) => (id ? `/offers/${id}` : '/offers'),
  batchOffer: (id?: string | number) => (id ? `/batch-offers/${id}` : '/batch-offers'),
  offerRequests: (id?: string | number) => (id ? `/offer-requests/${id}` : '/offer-requests'),

  /** Transaction */
  transactions: (txHash?: string) => (txHash ? `/transactions/${txHash}` : '/transactions'),
  transactionLoan: (loanHash: string) => `/transaction/loan/${loanHash}`,

  /** Prediction Sets */
  predictionSets: '/prediction-sets',
};

export default Endpoints;
