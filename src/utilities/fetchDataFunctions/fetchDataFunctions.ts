import { storefront, ProductSortKeys } from '../storefront';

export const fetchProductByKey = async (
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

export const fetchPrivacyPolicy = async () => {
  const { shop } = await storefront.query({
    shop: {
      privacyPolicy: {
        title: true,
        body: true,
      },
    },
  });
  return shop.privacyPolicy;
};
