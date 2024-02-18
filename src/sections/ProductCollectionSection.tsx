import { storefront } from '@site/utilities/storefront';
import { NextImage, NextLink, useState, useAsyncFn, DataProps, invariant } from '@site/utilities/deps';
import { Button } from '@site/snippets';
import { Money } from '@shopify/hydrogen-react';


export async function fetchProductCollectionSection(handle: string, cursor?: string) {
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
}

type ProductListCollectionSectionProps = {
  data: DataProps<typeof fetchProductCollectionSection>['data']
  handle: string;
}

export function ProductListCollectionSection({data, handle}: ProductListCollectionSectionProps ) {

  const [pages, setPages] = useState([data.products]);
  const lastPage = pages[pages.length - 1];
  const lastCursor = lastPage.edges[lastPage.edges.length - 1].cursor;
  const hasNextPage = lastPage.pageInfo.hasNextPage;

  const [loader, load] = useAsyncFn(async () => {
    const productList = await fetchProductCollectionSection(handle, lastCursor);
    setPages([...pages, productList.products]);
  }, [lastCursor]);

  return (
    <section>
      <div className='flex flex-col gap-10 pb-4 sm:p-10 md:flex-row md:gap-20'>
      <h2 className='text-center text-4xl font-bold'>{data.title}</h2>
      <p className='text-center'>{data.description}</p> 
      </div>
      <div className="mb-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:pt-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {pages
          .flatMap(({ edges }) => edges)
          .map(({ node }) => ( 
            <NextLink key={node.handle} href={`/products/${node.handle}`} className="group m-auto">
               <div className="relative h-[240px] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 md:w-[300px]">
                <NextImage
                  src={node.featuredImage!.url}
                  alt={node.featuredImage!.altText || ''}
                  fill
                  className="!relative max-h-full max-w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{node.title}</h3>
              <div className="mt-1 text-lg font-medium text-gray-900">
                <Money data={node.priceRange.minVariantPrice}></Money>
              </div>
            </NextLink>
          ))}
      </div>

      {hasNextPage && (
        <div className="text-center">
          <Button color={loader.error ? 'danger' : 'primary'} size="md" onClick={load} disabled={loader.loading}>
            {loader.loading ? 'Loading' : loader.error ? 'Try Again' : 'Load More'}
          </Button>
        </div>
      )}
    </section>
  );
}
