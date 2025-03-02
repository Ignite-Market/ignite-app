import type { PredictionSetActivity } from '#components';

const Endpoints = {
  /** User */
  me: '/users/me',
  user: (id: number) => `/users/${id}`,
  walletMessage: '/users/wallet-message',
  walletLogin: '/users/wallet-login',

  /** User predictions */
  userPredictions: (id: number) => `/users/${id}/predictions`,
  userActivity: (id: number) => `/users/${id}/activity`,

  // NOT USED
  changeMail: '/users/change-email',
  changeMailRequest: '/users/change-email-request',
  notification: '/notification',

  /** Prediction Sets */
  predictionSets: '/prediction-sets',
  predictionSetsById: (id: number) => `/prediction-sets/${id}`,
  predictionSetChanceHistory: (id: number) => `/prediction-sets/${id}/chance-history`,
  PredictionSetActivity: (id: number) => `/prediction-sets/${id}/activity`,

  /** Prediction set comments */
  comments: '/comments',
  commentById: (id: number) => `/comments/${id}`,
  predictionSetComments: (id: number) => `/comments/prediction-set/${id}`,

  /** User prediction watchlist */
  predictionSetUserWatchlist: (id: number) => `/prediction-sets/${id}/watchlist`,
};

export default Endpoints;
