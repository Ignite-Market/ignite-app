import { useAccount } from '@wagmi/vue';
import { type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';
import { parseAssetMetadata } from '~/lib/misc/parsers';
import type { AssetInterface, NFT } from '~/lib/types/asset';

export default function useNft() {
  const { address } = useAccount();
  const { activeChain, getContractAddressByChain, initContract } = useContracts();

  /**
   * Read actions
   */
  async function getApproved(tokenId: number, contractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, contractAddress);
    return await contract.read.getApproved([tokenId]);
  }
  async function getBalance(contractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, contractAddress);
    return await contract.read.balanceOf([address.value]);
  }
  async function getName(contractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, contractAddress);
    return await contract.read.name([]);
  }
  async function getSymbol(contractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, contractAddress);
    return await contract.read.symbol([]);
  }
  async function getTokenOfOwner(id: number, contractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, contractAddress);
    return await contract.read.tokenOfOwnerByIndex([address.value, id]);
  }
  async function getTokenURI(id: number, contractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, contractAddress);
    return await contract.read.tokenURI([id]);
  }

  async function getNftById(id: number, nftContractAddress?: Address) {
    const contractAddress = nftContractAddress || getContractAddressByChain(ContractType.NFT);
    try {
      const uri = await getTokenURI(id, contractAddress);
      const metadata = await fetch(uri).then(response => {
        return response.json();
      });
      if (metadata && metadata.name) {
        return {
          id,
          uri,
          contractAddress,
          approved: await getApproved(id, contractAddress),
          chain: activeChain.value?.name,
          chainId: activeChain.value?.id,
          ...metadata,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  /**
   * Write actions
   */
  async function setApprovalForAll(nftContractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, nftContractAddress);

    return await contract.write.setApprovalForAll([getContractAddressByChain(), true]);
  }

  async function approve(tokenId: number, nftContractAddress?: Address) {
    const contract = await initContract(ContractType.NFT, nftContractAddress);
    console.log(nftContractAddress, getContractAddressByChain());

    return await contract.write.approve([getContractAddressByChain(), tokenId]);
  }

  /** Other */
  async function parseAssetToNft(asset: AssetInterface): Promise<NFT> {
    const metadata = parseAssetMetadata(asset.metadata);
    return {
      ...metadata,
      id: asset.tokenId,
      uri: asset.tokenURI,
      chainId: asset.chainId,
      contractAddress: asset.contractAddress,
      approved: '',
      // approved: await getApproved(asset.tokenId, asset.contractAddress),
    };
  }

  return {
    getApproved,
    getBalance,
    getNftById,
    getName,
    getSymbol,
    getTokenOfOwner,
    getTokenURI,
    approve,
    setApprovalForAll,
    parseAssetToNft,
  };
}
