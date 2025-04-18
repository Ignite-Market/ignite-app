const Endpoints = {
  /** User */
  me: '/users/me',
  user: (id: number) => `/users/${id}`,
  walletMessage: '/users/wallet-message',
  walletLogin: '/users/wallet-login',
  userUpdate: '/users/update-profile',

  /** User predictions */
  userPredictions: (id: number) => `/users/${id}/predictions`,

  // NOT USED
  changeMail: '/users/change-email',
  changeMailRequest: '/users/change-email-request',
  notification: '/notification',

  /** Prediction Sets */
  predictionSets: '/prediction-sets',
  predictionSetsById: (id: number) => `/prediction-sets/${id}`,
  predictionSetChanceHistory: (id: number) => `/prediction-sets/${id}/chance-history`,
  predictionSetActivity: `/prediction-sets/activity`,
  predictionSetHolders: `/prediction-sets/holders`,

  /** Prediction set comments */
  comments: '/comments',
  commentById: (id: number) => `/comments/${id}`,

  /** User prediction watchlist */
  predictionSetUserWatchlist: (id: number) => `/prediction-sets/${id}/watchlist`,

  /** Banners */
  banners: '/prediction-sets/banners',

  /** Proposals */
  proposals: '/proposals',
  proposalById: (id: number) => `/proposals/${id}`,
  proposalRounds: '/proposals/rounds',
  proposalRoundById: (id: number) => `/proposals/rounds/${id}`,
  voteOnProposal: (id: number) => `/proposals/${id}/vote`,

  /** Rewards */
  rewards: '/reward-points',
  rewardsMe: '/reward-points/me',
  dailyReward: '/reward-points/daily',

  /** Collateral tokens */
  collateralTokens: '/collateral-tokens',
};

export default Endpoints;
