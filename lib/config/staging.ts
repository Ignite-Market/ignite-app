import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: '',
  apiUrl: '',
  CONDITIONAL_TOKEN_CONTRACT: '0x34997462F89b10F5a5d9b38c13Ce38f6853e370c',
  ORACLE_CONTRACT: '0x989a77C463c193Fb95bAB561355Be7A569894623',
  THIRDWEB_CLIENT_KEY: 'cb9fdd79dc90a00bb25834371066f31b',
  WALLETCONNECT_PROJECT_ID: 'f87929125f3f3007a20ef6fa00f62098',
  PROSOPO_CAPTCHA_SITEKEY: '5GGdgC2weguM6aGVMTC9ckfdj3FQP7qkhbzHw6WgqhJfXvZw',
};

export default config;
