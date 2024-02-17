import { PageProps, NextSeo,  fetchStaticProps} from '@site/utilities/deps';
import { StoreLayout } from '@site/layouts/StoreLayout';
import { ProductListCollectionSection, fetchProductCollectionSection } from '@site/sections/ProductCollectionSection';

const HANDLE = 'earrings'

export const getStaticProps = fetchStaticProps(async () => {

  return {
    props: {
      data: {
        productCollectionSection: await fetchProductCollectionSection(HANDLE),
      },
    },
    revalidate: 60,
  };
});

export default function Page(props: PageProps<typeof getStaticProps>) {
  return (
    <StoreLayout>
      <NextSeo title="Earrings" description="Luxurious earrings from Next Shopify Storefront" />
      <ProductListCollectionSection data={props.data.productCollectionSection} handle={HANDLE}/>
    </StoreLayout>
  );
}
