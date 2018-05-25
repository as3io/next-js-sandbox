import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

// The client-side apollo client.
// Will be initialized once.
let apolloClient;

const { NODE_ENV } = process.env;

const createDefaultCache = () => new InMemoryCache();

const create = (apolloConfig, initialState) => {
  const isBrowser = process.browser;

  // Allow for custom cache creation. Will default to `InMemoryCache`.
  const createCache = apolloConfig.createCache || createDefaultCache;

  const config = {
    // Spread/apply the passed config properties.
    ...apolloConfig,
    // Only allow dev tools if on a non-production browser.
    connectToDevTools: isBrowser && NODE_ENV !== 'production',
    // Enable SSR mode if running on the server.
    ssrMode: !isBrowser,
    // Create cache and restore from initial state.
    cache: createCache().restore(initialState || {}),
  };
  delete config.createCache;

  return new ApolloClient(config);
};

export default function initApollo(config, initialState, req) {
  let apolloConfig;
  if (typeof config === 'function') {
    apolloConfig = config(req);
  } else {
    apolloConfig = config;
  }
  // On the server, ensure a new client is created for every request.
  // @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#server-initialization
  if (!process.browser) {
    return create(apolloConfig, initialState);
  }

  // Reuse the same client instance.
  if (!apolloClient) {
    apolloClient = create(apolloConfig, initialState);
  }
  return apolloClient;
}
