const Endpoints = {
  /**
   * User
   */
  me: '/users/me',
  user: (id: number) => `/users/${id}`,
  walletMessage: '/users/wallet-message',
  walletLogin: '/users/wallet-login',
  userUpdate: '/users/update-profile',

  emailVerification: '/users/email-verification',

  /**
   * User positions
   */
  userPredictions: (id: number) => `/users/${id}/predictions`,
  userFundingPositions: (id: number) => `/users/${id}/funding-positions`,

  // NOT USED
  changeMail: '/users/change-email',
  changeMailRequest: '/users/change-email-request',
  notification: '/notification',

  /**
   * Prediction Sets
   */
  predictionSets: '/prediction-sets',
  predictionSetsAdmin: '/prediction-sets/admin',
  predictionSetsById: (id: number) => `/prediction-sets/${id}`,
  predictionSetChanceHistory: (id: number) => `/prediction-sets/${id}/chance-history`,
  predictionSetActivity: `/prediction-sets/activity`,
  predictionSetHolders: `/prediction-sets/holders`,
  predictionSetPositions: (id: number) => `/prediction-sets/${id}/positions`,
  predictionSetFundingPositions: (id: number) => `/prediction-sets/${id}/funding-positions`,
  predictionSetRemovedFunding: (id: number) => `/prediction-sets/${id}/removed-funding`,
  predictionSetsProcess: (id: number) => `/prediction-sets/${id}/process`,
  predictionSetDataSources: (id: number) => `/prediction-sets/${id}/data-sources`,

  /**
   * Prediction set comments
   */
  comments: '/comments',
  commentById: (id: number) => `/comments/${id}`,

  /**
   * User prediction watchlist
   */
  predictionSetUserWatchlist: (id: number) => `/prediction-sets/${id}/watchlist`,

  /**
   * Prediction set suggestions
   */
  predictionSetsSuggestions: '/prediction-sets/generate-suggestions',

  /**
   * Data sources
   */
  dataSources: '/data-sources',
  testJqQuery: '/data-sources/test-jq',

  /**
   * Prediction templates
   */
  predictionTemplates: '/prediction-templates',
  predictionTemplateById: (id: string) => `/prediction-templates/${id}`,
  generateFromTemplate: (id: string) => `/prediction-templates/${id}/generate`,

  /**
   * Banners
   */
  banners: '/banners',
  bannersAdmin: '/banners/admin',
  bannerById: (id: number) => `/banners/${id}`,
  bannerToggle: (id: number) => `/banners/${id}/toggle`,

  /**
   * Proposals
   */
  proposals: '/proposals',
  proposalById: (id: number) => `/proposals/${id}`,
  proposalRounds: '/proposals/rounds',
  proposalRoundById: (id: number) => `/proposals/rounds/${id}`,
  voteOnProposal: (id: number) => `/proposals/${id}/vote`,

  /**
   * Rewards
   */
  rewards: '/reward-points',
  rewardsMe: '/reward-points/me',
  dailyReward: '/reward-points/daily',

  /**
   * Collateral tokens
   */
  collateralTokens: '/collateral-tokens',

  /**
   * Leaderboards
   */
  leaderboardVolume: '/stats/leaderboard/volume',
  leaderboardProfit: '/stats/leaderboard/profit',
  leaderboardPoints: '/stats/leaderboard/points',

  /**
   * File upload
   */
  imageUpload: '/files/image',

  /**
   * Airdrop
   */
  airdropJoin: '/airdrop/join',
};

export default Endpoints;
