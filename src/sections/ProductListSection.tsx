import { ProductSortKeys, storefront } from '@site/utilities/storefront';
import { NextImage, NextLink, useState, useAsyncFn, DataProps } from '@site/utilities/deps';
import { Button } from '@site/snippets';
import { Money } from '@shopify/hydrogen-react';
import { Select, Option } from '@site/snippets/Select';
import { fetchProductByKey } from '@site/utilities/fetchDataFunctions/fetchDataFunctions';
import { SearchInput } from '@site/snippets/SearchInput';
import { useDebounce } from '@site/hooks/use-debounce';

enum SortKey {
  ALL = 'All',
  LOW_TO_HIGH = 'Lowest price',
  HIGH_TO_LOW = 'Highest price',
  LATEST = 'Latest',
}

export async function fetchProductListSection(cursor?: string, query?: string) {
  const { products } = await storefront.query({
    products: [
      { first: 12, after: cursor || null, query: query ? `title:${query}*` : undefined },
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
  const [sortKey, setSortKey] = useState<SortKey>(SortKey.ALL);
  const [searchPhrase, setSearchPhrase] = useState('');
  const lastPage = pages[pages.length - 1];
  const lastCursor = lastPage?.edges[lastPage.edges.length - 1]?.cursor;
  const hasNextPage = lastPage.pageInfo.hasNextPage;
  const sortOptions = (Object.keys(SortKey) as Array<keyof typeof SortKey>).map((key) => ({ name: SortKey[key] }));

  const fetchSortedProductsWithQuery = async (lastCursor?: string) => {
    let productList;
    switch (sortKey) {
      case SortKey.ALL:
        productList = await fetchProductListSection(lastCursor, searchPhrase);
        break;
      case SortKey.LOW_TO_HIGH:
        productList = await fetchProductByKey(ProductSortKeys.PRICE, lastCursor, false, searchPhrase);
        break;
      case SortKey.HIGH_TO_LOW:
        productList = await fetchProductByKey(ProductSortKeys.PRICE, lastCursor, true, searchPhrase);
        break;
      case SortKey.LATEST:
        productList = await fetchProductByKey(ProductSortKeys.CREATED_AT, lastCursor, true, searchPhrase);
        break;
      default:
        productList = await fetchProductListSection(lastCursor, searchPhrase);
    }
    return productList;
  };

  const [loader, load] = useAsyncFn(async () => {
    const newProductList = await fetchSortedProductsWithQuery(lastCursor);
    setPages([...pages, newProductList]);
  }, [lastCursor]);

  const sortProduct = async (value: Option) => {
    let productList;
    setSearchPhrase('');

    switch (value.name) {
      case SortKey.ALL:
        setSortKey(SortKey.ALL);
        productList = await fetchProductListSection();
        break;
      case SortKey.LOW_TO_HIGH:
        setSortKey(SortKey.LOW_TO_HIGH);
        productList = await fetchProductByKey(ProductSortKeys.PRICE);
        break;
      case SortKey.HIGH_TO_LOW:
        setSortKey(SortKey.HIGH_TO_LOW);
        productList = await fetchProductByKey(ProductSortKeys.PRICE, undefined, true);
        break;
      case SortKey.LATEST:
        setSortKey(SortKey.LATEST);
        productList = await fetchProductByKey(ProductSortKeys.CREATED_AT, undefined, true);
        break;
      default:
        productList = await fetchProductListSection();
    }

    setPages([productList]);
  };

  useDebounce(
    async () => {
      const newProductList = await fetchSortedProductsWithQuery();
      setPages([newProductList]);
    },
    [searchPhrase],
    500
  );

  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col justify-center gap-5 sm:flex-row lg:max-w-[250px] lg:flex-col">
          <Select onChange={sortProduct} options={sortOptions} label="Sort by:" />
          <SearchInput
            name="search"
            label="Search products:"
            onChange={(event) => setSearchPhrase(event.target.value)}
            value={searchPhrase}
          />
        </div>
        <div className="flex flex-1 justify-center">
          <h2 className="sr-only">Products</h2>
          <div className="m-auto mb-10 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            {pages
              .flatMap(({ edges }) => edges)
              .map(({ node }) => (
                <NextLink key={node.handle} href={`/products/${node.handle}`} className="group">
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
            {!pages[0].edges.length && (
              <div className="w-full py-5">
                <p className="text-base">Product not found</p>
              </div>
            )}
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
