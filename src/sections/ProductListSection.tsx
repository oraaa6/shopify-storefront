import { storefront } from '@site/utilities/storefront';
import { NextImage, NextLink, useState, useAsyncFn, DataProps } from '@site/utilities/deps';
import { Button } from '@site/snippets';
import { Money } from '@shopify/hydrogen-react';
import { Select, Option } from '@site/snippets/Select';
import { fetchProductByPrice } from '@site/utilities/fetchProductsFunctions/fetchProductsFunctions';

enum SortKey {
  ALL = 'All',
  LOW_TO_HIGH = 'Lowest price',
  HIGH_TO_LOW = 'Highest price'
}

export async function fetchProductListSection(cursor?: string) {
  const { products } = await storefront.query({
    products: [
      { first: 12, after: cursor || null },
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
}

export function ProductListSection(props: DataProps<typeof fetchProductListSection>) {
  const [pages, setPages] = useState([props.data]);
  const [sortKey, setSortKey] = useState<SortKey>(SortKey.ALL)
  const lastPage = pages[pages.length - 1];
  const lastCursor = lastPage.edges[lastPage.edges.length - 1].cursor;
  const hasNextPage = lastPage.pageInfo.hasNextPage;
  const sortOptions = (Object.keys(SortKey) as Array<keyof typeof SortKey>).map((key) => ({name: SortKey[key]}))

  const [loader, load] = useAsyncFn(async () => {
    let productList;
    switch(sortKey) {
      case SortKey.ALL:
        productList = await fetchProductListSection(lastCursor);
        break;
      case SortKey.LOW_TO_HIGH:
        productList = await fetchProductByPrice(lastCursor);
        break;
      case SortKey.HIGH_TO_LOW:
        productList = await fetchProductByPrice(lastCursor, true);
        break;
      default:
        productList = await fetchProductListSection()
    }
   setPages([...pages, productList]);
  }, [lastCursor]);

  
  const sortProduct = async (value: Option) => {
    let productList;
    switch(value.name) {
      case SortKey.ALL:
        setSortKey(SortKey.ALL)
        productList = await fetchProductListSection();
        break;
      case SortKey.LOW_TO_HIGH:
        setSortKey(SortKey.LOW_TO_HIGH)
        productList = await fetchProductByPrice();
        break;
      case SortKey.HIGH_TO_LOW:
        setSortKey(SortKey.HIGH_TO_LOW)
        productList = await fetchProductByPrice(undefined, true);
        break;
      default:
        productList = await fetchProductListSection()
    }
    setPages([productList]);
  }

  return (
    <section>
      <div className='flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-start'>
        <Select onChange={sortProduct} options={sortOptions} label="Sort by:"/>
      <div className='flex justify-center'>
        <h2 className="sr-only">Products</h2>
        <div className="m-auto mb-10 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
      
        {pages
          .flatMap(({ edges }) => edges)
          .map(({ node }) => (
            <NextLink key={node.handle} href={`/products/${node.handle}`} className="group">
              <div className="relative h-[240px] w-[300px] overflow-hidden rounded-lg bg-gray-200">
                <NextImage
                  src={node.featuredImage!.url}
                  alt={node.featuredImage!.altText || ''}
                  fill
                  className="relative size-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{node.title}</h3>
              <div className="mt-1 text-lg font-medium text-gray-900">
                <Money data={node.priceRange.minVariantPrice}></Money>
              </div>
            </NextLink>
          ))}
          </div>
      </div>
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
