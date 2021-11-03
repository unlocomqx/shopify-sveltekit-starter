import { authenticatedFetch } from "$lib/shopify/fetch";
import * as ApolloCore from "@apollo/client/core/core.cjs.js";
import * as ApolloClient from "@apollo/client/apollo-client.cjs.js";
import { SvelteApolloClient } from "svelte-apollo-client";

const { InMemoryCache } = ApolloCore;
const { HttpLink } = ApolloClient;

const link = new HttpLink({
  uri: "/graphql",
  fetch: authenticatedFetch(),
  fetchOptions: {
    credentials: "include",
  },
});

export const client = SvelteApolloClient({
  link,
  cache: new InMemoryCache(),
});

export async function query<T>(q, options): Promise<T> {
  const op = client.query<T>(q, options);

  return new Promise((resolve, reject) => {
    const unsub = op.subscribe(response => {
      if (!response.loading && !response.error) {
        unsub();
        resolve(response.data);
      }
      if (response.error) {
        unsub();
        reject(response.error);
      }
    });
  });
}
