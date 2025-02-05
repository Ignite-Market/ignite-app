import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app-dev.ignitemarket.xyz/',
  apiUrl: 'https://api-dev.ignitemarket.xyz',
  COLLATERAL_TOKEN_CONTRACT: '0x82AF954d52Bb42F5075c392323D983415fe68672',
  CONDITIONAL_TOKEN_CONTRACT: '0x2346Cfa50e396BeFC2242763eD15Ca0aab1E9a79',
  FPMM_FACTORY_CONTRACT: '0x88436658f14A7cA6CE18C514A7af605Bb6329Bb7',
};

export default config;
