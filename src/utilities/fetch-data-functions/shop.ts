import { storefront } from '../storefront';

/**
 * Returns shop's Privacy Policy
 *
 */
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
