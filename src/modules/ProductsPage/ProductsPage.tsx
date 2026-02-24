import { useCallback } from 'react';

import { getProducts } from '../shared/api/apiClient';
import { useAsync } from '../shared/hooks/useAsync';
import type { ProductCategory } from '../shared/types/product';

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
    return <div>Loading {TITLES[category]}...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Something went wrong: {error}</p>
        <button type="button" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <h1>{TITLES[category]}</h1>
      <p>
        {products?.length ?? 0} {TITLES[category].toLowerCase()} found
      </p>

      {/* Temporary wiring check — replaced in Step 5 */}
      <ul>
        {products?.slice(0, 10).map(product => (
          <li key={product.id}>
            {product.name} — ${product.price}
          </li>
        ))}
      </ul>
    </>
  );
};
