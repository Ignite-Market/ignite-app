/**
 * If there is a referral code in the url, set it in localStorage.
 */
export default defineNuxtRouteMiddleware((to, _from) => {
  // Check if there's a referral code in the URL query parameters
  const referralCode = to.query.referral;

  // If a referral code exists, store it in localStorage
  if (referralCode && typeof referralCode === 'string') {
    console.log('referralCode', referralCode);
    if (import.meta.client) {
      localStorage.setItem('referralCode', referralCode);
    }
  }
});
