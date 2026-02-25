import { type ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';

import { getProducts } from '../shared/api/apiClient';
import { useAsync } from '../shared/hooks/useAsync';
import { ProductsList } from '../shared/components/ProductsList';
import type { Product, ProductCategory } from '../shared/types/product';
import styles from './ProductsPage.module.scss';

type SortKey = 'age' | 'title' | 'price';
type PerPage = '4' | '8' | '16' | 'all';

type Props = {
  category: ProductCategory;
};

const TITLES: Record<ProductCategory, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'age', label: 'Newest' },
  { value: 'title', label: 'Alphabetically' },
  { value: 'price', label: 'Cheapest' },
];

const PER_PAGE_OPTIONS: PerPage[] = ['4', '8', '16', 'all'];

const VALID_SORT: SortKey[] = ['age', 'title', 'price'];
const VALID_PER_PAGE: PerPage[] = ['4', '8', '16', 'all'];

// ─── Pure helpers ─────────────────────────────────────────────────────────────
const getDiscountedPrice = (p: Product): number => p.price;

const sortProducts = (list: Product[], sort: SortKey): Product[] => {
  const copy = [...list];

  switch (sort) {
    case 'title':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'price':
      return copy.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    case 'age':
    default:
      return copy.sort((a, b) => b.year - a.year);
  }
};

const paginate = <T,>(items: T[], page: number, perPage: number): T[] =>
  items.slice((page - 1) * perPage, page * perPage);

// ─────────────────────────────────────────────────────────────────────────────
export const ProductsPage = ({ category }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawSort = searchParams.get('sort');
  const rawPerPage = searchParams.get('perPage');
  const rawPage = searchParams.get('page');

  const sort: SortKey = VALID_SORT.includes(rawSort as SortKey)
    ? (rawSort as SortKey)
    : 'age';

  const perPage: PerPage = VALID_PER_PAGE.includes(rawPerPage as PerPage)
    ? (rawPerPage as PerPage)
    : 'all';

  const page = Math.max(1, Number(rawPage) || 1);

  const fetchByCategory = useCallback(
    () => getProducts().then(all => all.filter(p => p.category === category)),
    [category],
  );

  const { data: products, loading, error, reload } = useAsync(fetchByCategory);

  const sorted = useMemo(
    () => sortProducts(products ?? [], sort),
    [products, sort],
  );

  const totalItems = sorted.length;

  const perPageNum = useMemo(
    () => (perPage === 'all' ? Math.max(totalItems, 1) : Number(perPage)),
    [perPage, totalItems],
  );

  const totalPages = Math.ceil(totalItems / perPageNum) || 1;
  const clampedPage = Math.max(1, Math.min(page, totalPages));

  const visible = useMemo(
    () =>
      perPage === 'all' ? sorted : paginate(sorted, clampedPage, perPageNum),
    [perPage, sorted, clampedPage, perPageNum],
  );

  // Clamp out-of-range page in URL after products load
  useEffect(() => {
    if (products && clampedPage !== page) {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev);

          if (clampedPage === 1) {
            next.delete('page');
          } else {
            next.set('page', String(clampedPage));
          }

          return next;
        },
        { replace: true },
      );
    }
  }, [clampedPage, page, products, setSearchParams]);

  const setParam = (key: string, value: string | null, resetPage = true) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);

      if (value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }

      if (resetPage) {
        next.delete('page');
      }

      return next;
    });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortKey;

    setParam('sort', val === 'age' ? null : val);
  };

  const handlePerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;

    setParam('perPage', val === 'all' ? null : val);
  };

  const handlePageChange = (newPage: number) => {
    setParam('page', newPage === 1 ? null : String(newPage), false);
  };

  const showPagination = perPage !== 'all' && totalPages > 1;

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Loading {TITLES[category]}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Something went wrong: {error}</p>
        <button type="button" onClick={reload} className={styles.reloadBtn}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{TITLES[category]}</h1>
      <p className={styles.count}>{totalItems} models</p>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label htmlFor="sort-select" className={styles.controlLabel}>
            Sort by
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="sort-select"
              className={styles.select}
              value={sort}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label htmlFor="per-page-select" className={styles.controlLabel}>
            Items on page
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="per-page-select"
              className={styles.select}
              value={perPage}
              onChange={handlePerPageChange}
            >
              {PER_PAGE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ProductsList products={visible} />

      {showPagination && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handlePageChange(p)}
              className={cn(styles.pageBtn, {
                [styles.pageBtnActive]: p === clampedPage,
              })}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
