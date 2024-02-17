import { storefront, ProductSortKeys } from '../storefront';

export const fetchProductByPrice = async (cursor?: string, reverse?: boolean) => {
  const { products } = await storefront.query({
    products: [
      { first: 12, sortKey: ProductSortKeys.PRICE, after: cursor || null, reverse },
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
