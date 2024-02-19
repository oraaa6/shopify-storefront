import { PageProps, NextSeo, fetchStaticProps } from '@site/utilities/deps';
import { StoreLayout } from '@site/layouts/StoreLayout';
import { ProductListCollectionSection } from '@site/sections/ProductCollectionSection';
import { fetchCollection } from '@site/utilities/fetch-data-functions/collections';

const HANDLE = 'necklace';

export const getStaticProps = fetchStaticProps(async () => {
  return {
    props: {
      data: {
        productCollectionSection: await fetchCollection(HANDLE),
      },
    },
    revalidate: 60,
  };
});

export default function Page(props: PageProps<typeof getStaticProps>) {
  return (
    <StoreLayout>
      <NextSeo title="Necklaces" description="Luxurious necklaces from Next Shopify Storefront" />
      <ProductListCollectionSection data={props.data.productCollectionSection} handle={HANDLE} />
    </StoreLayout>
  );
}
