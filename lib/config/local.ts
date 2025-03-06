import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:6060',
  COLLATERAL_TOKEN_CONTRACT: '0x822139B372dbFc063470Ae0d2361d9550838BB49',
  CONDITIONAL_TOKEN_CONTRACT: '0x3c1947f48BAA623B264e86cF1ac85AE3FCd09904',
  FPMM_FACTORY_CONTRACT: '0x70a12cC5796ccd42A40566153A05E8095dEBE528',
  ORACLE_CONTRACT: '0x0BEa58C9b38B1BC764bacc7D331D4A2D2040F14c',
};

export default config;
