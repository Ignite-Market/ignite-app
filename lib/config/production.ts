import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.ignitemarket.xyz/',
  apiUrl: 'https://api.ignitemarket.xyz',
  CONDITIONAL_TOKEN_CONTRACT: '0xC3C077A248e36418eA9CC23A684aBf8677C09B58',
  ORACLE_CONTRACT: '0xdDd3124827802A8f848dbFd993fB4eb2b36ab487',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
