import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.ignitemarket.xyz/',
  apiUrl: 'https://api-dev.ignitemarket.xyz',
  CONDITIONAL_TOKEN_CONTRACT: '0x34997462F89b10F5a5d9b38c13Ce38f6853e370c',
  ORACLE_CONTRACT: '0x989a77C463c193Fb95bAB561355Be7A569894623',
};

export default config;
