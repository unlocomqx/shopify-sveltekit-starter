import type { Collection } from "@shopify/app-bridge/actions/ResourcePicker";
import type { Shop } from "@prisma/client";
import type { Session } from "@shopify/shopify-api/dist/auth/session";
import { query } from "$lib/graphql/node-client";

export async function getProducts(collection: Collection, { shop, session }: { shop: Shop, session: Session }) {
  let products = [];

  const _query = `
    query getCollection($id: ID!, $first: Int, $cursor: String) {
      collection(id: $id) {
        products (first: $first, after: $cursor) {
          edges {
            node {
              id
              title
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }`;

  let cursor = undefined;

  async function fetchProducts() {
    const data = await query<{ collection: any }>(shop, session, {
      query: _query,
      variables: {
        id: collection.id,
        first: 10,
        cursor,
      },
    });
    const productsData = data.collection.products;
    if (productsData.pageInfo.hasNextPage) {
      cursor = productsData.edges[productsData.edges.length - 1].cursor;
      await fetchProducts();
    }
    products = [...products, ...(productsData.edges.map(edge => edge.node))];
    return products;
  }

  return await fetchProducts();
}
