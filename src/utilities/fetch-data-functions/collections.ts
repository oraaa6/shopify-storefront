import { storefront } from '../storefront';
import { invariant } from '@site/utilities/deps';

/**
 * Returns product collection by provided handle
 *
 */

export const fetchCollection = async (handle: string, cursor?: string) => {
  const { collectionByHandle } = await storefront.query({
    collectionByHandle: [
      { handle },
      {
        title: true,
        description: [{ truncateAt: 1000 }, true],
        products: [
          { first: 12, after: cursor || null },
          {
            pageInfo: {
              hasNextPage: true,
            },
            edges: {
              cursor: true,
              node: {
                id: true,
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
      },
    ],
  });

  invariant(collectionByHandle, `Product not found: ${handle}`);

  return collectionByHandle;
};
