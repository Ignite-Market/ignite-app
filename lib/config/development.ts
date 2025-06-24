import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.ignitemarket.xyz/',
  apiUrl: 'https://api-dev.ignitemarket.xyz',
  CONDITIONAL_TOKEN_CONTRACT: '0x55613b6ECeb4b6e83C2398c425b62187f0A758a9',
  ORACLE_CONTRACT: '0xBEF2D7A7D9F2d3E335b13A2b2bB9BfDBc1589da1',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
