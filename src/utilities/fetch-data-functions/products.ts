import { storefront, ProductSortKeys } from '../storefront';
import { formatTitle, invariant } from '@site/utilities/deps';
import { truncate } from 'lodash';

/**
 * Returns products by provided key or query
 *
 */
export const fetchProductsByKey = async (
  sortKey: ProductSortKeys,
  cursor?: string,
  reverse?: boolean,
  query?: string
) => {
  const { products } = await storefront.query({
    products: [
      {
        first: 12,
        sortKey,
        after: cursor || null,
        reverse,
        query: query ? `title:${query}*` : undefined,
      },
      {
        pageInfo: {
          hasNextPage: true,
        },
        edges: {
          cursor: true,
          node: {
            handle: true,
            title: true,
            priceRange: {
              minVariantPrice: {
                amount: true,
                currencyCode: true,
              },
            },
            featuredImage: {
              url: [{ transform: { maxWidth: 500 } }, true],
              altText: true,
              width: true,
              height: true,
            },
          },
        },
      },
    ],
  });
  return products;
};

/**
 * Returns products by provided query
 *
 */
export const fetchProductList = async (cursor?: string, query?: string) => {
  const { products } = await storefront.query({
    products: [
      { first: 12, after: cursor || null, query: query ? `title:${query}*` : undefined },
      {
        pageInfo: {
          hasNextPage: true,
        },
        edges: {
          cursor: true,
          node: {
            handle: true,
            title: true,
            priceRange: {
              minVariantPrice: {
                amount: true,
                currencyCode: true,
              },
            },
            featuredImage: {
              url: [{ transform: { maxWidth: 500 } }, true],
              altText: true,
              width: true,
              height: true,
            },
          },
        },
      },
    ],
  });

  return products;
};

/**
 * Returns single product by provided handle
 *
 */
export const fetchSingleProduct = async (handle: string) => {
  const { productByHandle } = await storefront.query({
    productByHandle: [
      { handle },
      {
        title: true,
        description: [{ truncateAt: 256 }, true],
        seo: {
          title: true,
          description: true,
        },
        priceRange: {
          minVariantPrice: {
            amount: true,
            currencyCode: true,
          },
        },
        images: [
          { first: 250 },
          {
            nodes: {
              id: true,
              url: [
                {
                  transform: {
                    maxHeight: 600,
                  },
                },
                true,
              ],
              altText: true,
              width: true,
              height: true,
            },
          },
        ],
        options: [
          { first: 250 },
          {
            id: true,
            name: true,
            values: true,
          },
        ],
        variants: [
          { first: 250 },
          {
            nodes: {
              id: true,
              availableForSale: true,
              priceV2: {
                amount: true,
                currencyCode: true,
              },
              selectedOptions: {
                name: true,
                value: true,
              },
              image: {
                id: true,
              },
            },
          },
        ],
      },
    ],
  });

  invariant(productByHandle, `Product not found: ${handle}`);

  const { seo, title, description } = productByHandle;

  return {
    ...productByHandle,
    seo: {
      title: formatTitle(seo.title || title),
      description: seo.description || truncate(description, { length: 256 }),
    },
  };
};
