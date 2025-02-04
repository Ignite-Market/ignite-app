import { SimpleMerkleTree } from '@openzeppelin/merkle-tree';
import { useAccount, useChainId, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';
import { toBytes, type Address } from 'viem';
import { generateLoanHash, getCurrentTime } from '~/lib/misc/web3';
import type {
  AnyOfferRequest,
  OfferClaimData,
  OfferInterface,
  OfferListInterface,
  OfferRequestInterface,
  OfferRequestListInterface,
  OfferResponse,
} from '~/lib/types/offer';
import Endpoints from '~/lib/values/endpoints';
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { ContractType, chainToWormholeId } from '~/lib/config/contracts';

export default function useOffer() {
  const message = useMessage();
  const { $wagmiConfig } = useNuxtApp();

  const txWait = useTxWait();
  const assetStore = useAssetStore();
  const chainId = useChainId();
  const { address } = useAccount();
  const { createLoan, generateHash, validateSignature } = useLendeeFi();
  const { ensureCorrectNetwork, getContractAddressByChain } = useContracts();
  const { approve, getApproved, getBalance, getTokenOfOwner } = useNft();
  const { allowance, increaseAllowance } = useToken();
  const { calcCosts } = useWormhole();

  const loadingOfferRequest = ref<boolean>(false);

  async function checkAllowance(amount: bigint) {
    try {
      const userAllowance = await allowance();

      if (amount > userAllowance) {
        txWait.hash.value = await increaseAllowance(amount);

        const receipt = await txWait.wait();
        console.debug(receipt);

        return checkAllowance(amount);
      } else {
        return true;
      }
    } catch (e) {
      console.error(e);
      message.error(contractError(e));
      return false;
    }
    return true;
  }

  async function selectOfferRequest(
    offerRequest: AnyOfferRequest,
    expirationTime: number
  ): Promise<OfferInterface | null> {
    if (!address.value) return null;

    loadingOfferRequest.value = true;

    try {
      const asset = parseAssetFromOffer(offerRequest);

      const claimData: OfferClaimData = {
        lender: address.value,
        nftContract: asset.contractAddress,
        nftId: asset.tokenId,
        nftChainId: chainToWormholeId(asset.chainId),
        offerExpiration: expirationTime,
        collectionOffer: false,

        lendToken: getContractAddressByChain(ContractType.TOKEN, chainId.value),
        lendAmount: numToBigInt(Number(offerRequest.loanAmount)),
        lendChainId: chainToWormholeId(chainId.value),
        interestRate: offerRequest.interestRate,

        loanDuration: offerRequest.loanDuration,
        loanNonce: randomNumbers(9),
      };
      console.debug(claimData);

      const claim = generateLoanHash(claimData);
      const hash = await generateHash(claimData);
      console.log(claim);
      console.log(hash);

      const tree = SimpleMerkleTree.of([claim]);

      const signature = await signMessage($wagmiConfig as Config, { message: { raw: toBytes(tree.root) } });
      console.debug(await validateSignature(address.value, tree.root, signature));

      const bodyData = {
        assetId: asset.id,
        chainId: asset.chainId,
        contractAddress: asset.contractAddress,
        tokenId: asset.tokenId,
        borrowerAddress: offerRequest.borrowerAddress,
        interestRate: offerRequest.interestRate,

        lenderAddress: claimData.lender,
        loanTokenContract: claimData.lendToken,
        loanChainId: chainId.value,
        loanAmount: claimData.lendAmount.toString(),
        loanDuration: claimData.loanDuration,
        offerExpiration: expirationTime,
        nonce: claimData.loanNonce,

        signature,
        merkleRoot: tree.root,
        merkleProofs: tree.getProof(0),
      };

      const res = await $api.post<OfferResponse>(Endpoints.offers(), bodyData);

      return res.data;
    } catch (e) {
      console.error(e);
      message.error(apiError(e));
    }

    loadingOfferRequest.value = false;
    return null;
  }

  async function confirmOffer(offer: OfferInterface | OfferListInterface) {
    try {
      console.debug(offer);
      const asset = parseAssetFromOffer(offer);
      await ensureCorrectNetwork(asset.chainId);
      await checkApproval(asset.tokenId, asset.contractAddress);

      const claimData: OfferClaimData = {
        lender: offer.lenderAddress,
        nftContract: asset.contractAddress,
        nftId: asset.tokenId,
        nftChainId: chainToWormholeId(asset.chainId),
        offerExpiration: offer.offerExpiration,
        collectionOffer: false,

        lendToken: offer.loanTokenContract,
        lendAmount: BigInt(offer.loanAmount),
        lendChainId: chainToWormholeId(offer.loanChainId),
        interestRate: offer.interestRate,

        loanDuration: offer.loanDuration,
        loanNonce: offer.nonce,
      };
      console.debug(claimData);

      const proofs = typeof offer.merkleProofs === 'string' ? JSON.parse(offer.merkleProofs) : offer.merkleProofs;

      const costs = await calcCosts(asset.chainId, offer.loanChainId);
      console.debug(costs);

      txWait.hash.value = await createLoan(claimData, offer.merkleRoot, proofs, offer.signature, costs);
      message.info('Loan transaction created');

      const receipt = await txWait.wait();
      console.debug(receipt);

      if (receipt.isSuccess) {
        refreshNftIDs();
        message.success('Loan created');
      } else {
        message.error(
          'Loan creation failed. ' + (receipt.failureReason?.shortMessage || receipt.failureReason?.message)
        );
      }
      return receipt;
    } catch (e) {
      console.error(e);
      message.error(contractError(e));
    }
    return null;
  }

  async function checkApproval(tokenId: number, contractAddress: Address) {
    const approved = await getApproved(tokenId, contractAddress);
    if (approved !== getContractAddressByChain()) {
      try {
        txWait.hash.value = await approve(tokenId);
        const receipt = await txWait.wait();
        console.debug(receipt);
      } catch (e) {
        console.error(e);
        message.error(contractError(e));
      }
    }
  }

  async function refreshNftIDs() {
    if (assetStore.loadingNfts) return;

    assetStore.loadingNfts = true;
    try {
      const balance = await getBalance();
      assetStore.nftIDs.clear();

      Array.from({ length: Number(balance) }, async (_, i) => {
        const tokenId = Number(await getTokenOfOwner(i));
        assetStore.nftIDs.add(tokenId);
      });
    } catch (error) {
      console.error(error);
    }
    assetStore.loadingNfts = false;
  }

  return {
    loadingOfferRequest,
    checkAllowance,
    checkApproval,
    confirmOffer,
    refreshNftIDs,
    selectOfferRequest,
  };
}
