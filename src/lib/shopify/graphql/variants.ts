import { query } from "$lib/graphql/client";
import type { ProductVariant, ProductVariantConnection } from "shopify-admin-api-typings";
import { gql } from "@apollo/client/core/core.cjs.js";
import { dpa, dpa_variants } from "@ProductConfig/variables";
import { parseGid } from "@shopify/admin-graphql-api-utilities";
import { get } from "svelte/store";
import { getHandle } from "@utils/variants";

export async function getVariants(id_product): Promise<ProductVariant[]> {
  let nodes = [];

  const _query = gql`
      query getVariants($query: String, $first: Int, $cursor: String) {
        productVariants(query: $query, first: $first, after: $cursor) {
          edges {
            cursor
            node {
              id
              title
              selectedOptions {
                name
                value
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

  let cursor = undefined;

  async function fetchNodes() {
    const data = await query<{ productVariants: ProductVariantConnection }>(_query, {
      variables: {
        query: `product_id:${id_product}`,
        first: 10,
        cursor,
      },
    });
    const nodesData = data.productVariants;
    if (nodesData.pageInfo.hasNextPage) {
      cursor = nodesData.edges[nodesData.edges.length - 1].cursor;
      await fetchNodes();
    }
    nodes = [...nodes, ...(nodesData.edges.map(edge => edge.node))];
    return nodes;
  }

  return await fetchNodes();
}

export async function fetchVariants() {
  const dpa_variants_data = get(dpa_variants);
  if (dpa_variants_data.variants.length > 0) {
    return;
  }
  const variants = await getVariants(parseGid(dpa.product_config.id_product));
  const variants_with_handles = variants.map(variant => ({ ...variant, handle: getHandle(variant.selectedOptions) }));
  dpa_variants.updateVariants(variants_with_handles);
}
