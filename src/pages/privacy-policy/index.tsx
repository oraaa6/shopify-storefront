import { PageProps, NextSeo,  fetchStaticProps} from '@site/utilities/deps';
import { StoreLayout } from '@site/layouts/StoreLayout';
import { fetchPrivacyPolicy } from '@site/utilities/fetchDataFunctions/fetchDataFunctions';
import { PrivacyPolicySection } from '@site/sections/PrivacyPolicySection';


export const getStaticProps = fetchStaticProps(async () => {

  return {
    props: {
      data: {
        shopPrivacyPolicy: await fetchPrivacyPolicy(),
      },
    },
    revalidate: 60,
  };
});

export default function Page(props: PageProps<typeof getStaticProps>) {
  const { body = '', title = '' } = props.data.shopPrivacyPolicy || {}

  return (
    <StoreLayout>
      <NextSeo title={title} description={`${title} from Next Shopify Storefront`} />
      <PrivacyPolicySection privacyPolicyBody={body} title={title}/>
    </StoreLayout>
  );
}
