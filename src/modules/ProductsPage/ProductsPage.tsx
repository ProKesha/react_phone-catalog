import { useCallback } from 'react';

import { getProducts } from '../shared/api/apiClient';
import { useAsync } from '../shared/hooks/useAsync';
import { ProductsList } from '../shared/components/ProductsList';
import type { ProductCategory } from '../shared/types/product';
import styles from './ProductsPage.module.scss';

type Props = {
  category: ProductCategory;
};

const TITLES: Record<ProductCategory, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

export const ProductsPage = ({ category }: Props) => {
  const fetchByCategory = useCallback(
    () =>
      getProducts().then(products =>
        products.filter(p => p.category === category),
      ),
    [category],
  );

  const { data: products, loading, error, reload } = useAsync(fetchByCategory);

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
      <p className={styles.count}>{products?.length ?? 0} models</p>
      <ProductsList products={products ?? []} />
    </div>
  );
};
