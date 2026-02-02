import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6060',
  CONDITIONAL_TOKEN_CONTRACT: '0x11B0f693E37e53DB1aA7f89ab8E360deD3468F30',
  ORACLE_CONTRACT: '0xc4Dd86578631F16093ceC832766578eE6f2ee2dF',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
