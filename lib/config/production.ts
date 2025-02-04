import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://app.lendeefi.com',
  apiUrl: 'https://api.lendeefi.com',
  lendeeFi: {
    base: '0x5FFc3666a83AdD188837A890b5111891C66CA5EA',
    bsc: '0xa37DbFB8c71aF9E2A0b3B9851646888b4E438e42',
    moonbeam: '0xeAc9f3b28cbe8e721eDEBA2E0ddE945BFa56c205',
  },
  nft: {
    base: '0x14EeBa9Cf473c007997dB49a7600835e543BA3F5',
    bsc: '0x28FCD9366F870e86a0C37a9eF93eEc1AC72be989',
    moonbeam: '0x9BeED2a1de623325eFe606eEaD0842a6F11A6867',
  },
  token: {
    base: '0x8805AF72d91f0Be32Dee24C2d28a7566795542fD',
    bsc: '0x4FbA81C1c082BB669293AbAfafF9e17E17Aa7Bf2',
    moonbeam: '0xa9e3fb862EDD7F537d1E180f3A78320178615235',
  },
};

export default config;
