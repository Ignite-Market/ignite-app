import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.ignitemarket.xyz/',
  apiUrl: 'https://api.ignitemarket.xyz',
  CONDITIONAL_TOKEN_CONTRACT: '0xB909Aa0d217C524d6F8151dE15456104677E9287',
  ORACLE_CONTRACT: '0x6E09F99aaE2a5896f315292c369821D3aEB6c160',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
