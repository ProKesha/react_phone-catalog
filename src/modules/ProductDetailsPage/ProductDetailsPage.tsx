import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { getProductDetails, getProducts } from '../shared/api/apiClient';
import { useAsync } from '../shared/hooks/useAsync';
import type { ProductDetails } from '../shared/types/productDetails';

export const ProductDetailsPage = () => {
  const { productId = '' } = useParams();

  const fetchDetails = useCallback(async (): Promise<ProductDetails | null> => {
    if (!productId) {
      return null;
    }

    const products = await getProducts();
    const base = products.find(p => p.itemId === productId);

    if (!base) {
      return null;
    }

    return getProductDetails(base.category, productId);
  }, [productId]);

  const { data: product, loading, error, reload } = useAsync(fetchDetails);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <>
        <p>Something went wrong: {error}</p>
        <button type="button" onClick={reload}>
          Try again
        </button>
      </>
    );
  }

  if (!product) {
    return <p>Product was not found</p>;
  }

  return <h1>{product.name}</h1>;
};
