import { Chains } from '../types/asset';

const endpointsGraphQL = {
  [Chains.MOONBEAM]: 'http://indexer-dev.lendeefi.com:8081/graphql',
  [Chains.MOONBASE]: 'http://indexer-dev.lendeefi.com:8081/graphql',
  [Chains.BSC]: 'http://indexer-dev.lendeefi.com:8082/graphql',
  [Chains.BSC_TESTNET]: 'http://indexer-dev.lendeefi.com:8082/graphql',
  [Chains.BASE]: 'http://indexer-dev.lendeefi.com:8083/graphql',
  [Chains.BASE_SEPOLIA]: 'http://indexer-dev.lendeefi.com:8083/graphql',
};

export class GraphQLClient {
  constructor() {}

  async request<T>(query: string, variables?: Record<string, any>, chainId = Chains.MOONBEAM): Promise<T> {
    try {
      const response = await fetch(endpointsGraphQL[chainId], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (json.errors) {
        console.error('GraphQL errors:', json.errors);
        throw new Error(`GraphQL Error: ${json.errors.map((e: any) => e.message).join(', ')}`);
      }

      return json.data;
    } catch (error) {
      console.error('Error making GraphQL request:', error);
      throw error;
    }
  }
}

export const $graphQLClient = new GraphQLClient();
