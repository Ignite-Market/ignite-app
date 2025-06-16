import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6060',
  CONDITIONAL_TOKEN_CONTRACT: '0xB909Aa0d217C524d6F8151dE15456104677E9287',
  ORACLE_CONTRACT: '0x6E09F99aaE2a5896f315292c369821D3aEB6c160',
  THIRDWEB_CLIENT_KEY: '0306ad941df0dd10deef7686668f3ad6',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
