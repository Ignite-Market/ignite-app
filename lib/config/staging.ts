import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.ignitemarket.xyz/',
  apiUrl: 'https://api-dev.ignitemarket.xyz',
  CONDITIONAL_TOKEN_CONTRACT: '0x1f75110bF2C2494542cc26469BEe169bC4e6fA4f',
  ORACLE_CONTRACT: '0xe97598CdFFd75efC698b7483a88612cf2570E72c',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
