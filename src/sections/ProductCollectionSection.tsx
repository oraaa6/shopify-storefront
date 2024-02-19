import { NextImage, NextLink, useState, useAsyncFn, DataProps } from '@site/utilities/deps';
import { Button } from '@site/snippets';
import { Money } from '@shopify/hydrogen-react';
import { fetchCollection } from '@site/utilities/fetch-data-functions/collections';

export async function getCollectionSection(handle: string, cursor?: string) {
  const products = await fetchCollection(handle, cursor);
  return products;
}

type ProductListCollectionSectionProps = {
  data: DataProps<typeof fetchCollection>['data'];
  handle: string;
};

export function ProductListCollectionSection({ data, handle }: ProductListCollectionSectionProps) {
  const [pages, setPages] = useState([data.products]);
  const lastPage = pages[pages.length - 1];
  const lastCursor = lastPage.edges[lastPage.edges.length - 1].cursor;
  const hasNextPage = lastPage.pageInfo.hasNextPage;

  const [loader, load] = useAsyncFn(async () => {
    const productList = await fetchCollection(handle, lastCursor);
    setPages([...pages, productList.products]);
  }, [lastCursor]);

  return (
    <section>
      <div className="flex flex-col gap-10 p-5 sm:p-10 md:flex-row md:gap-20">
        <h2 className="text-center text-4xl font-bold">{data.title}</h2>
        <p className="text-center">{data.description}</p>
      </div>
      <div className="mb-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:pt-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {pages
          .flatMap(({ edges }) => edges)
          .map(({ node }) => (
            <NextLink key={node.handle} href={`/products/${node.handle}`} className="group m-auto w-full">
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
