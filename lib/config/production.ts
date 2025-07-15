import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.ignitemarket.xyz/',
  apiUrl: 'https://api.ignitemarket.xyz',
  CONDITIONAL_TOKEN_CONTRACT: '0x11B0f693E37e53DB1aA7f89ab8E360deD3468F30',
  ORACLE_CONTRACT: '0x320C4791A63C6b44f40010F9e54Af80fEe6F25Ce',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
