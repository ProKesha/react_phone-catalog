import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { getProductDetails, getProducts } from '../shared/api/apiClient';
import { useAsync } from '../shared/hooks/useAsync';
import { Loader } from '../shared/components/Loader';
import type { ProductDetails } from '../shared/types/productDetails';
import styles from './ProductDetailsPage.module.scss';

const CATEGORY_LABELS: Record<string, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

export const ProductDetailsPage = () => {
  const { productId = '' } = useParams();
  const navigate = useNavigate();

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

  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <p>Something went wrong: {String(error)}</p>
        <button type="button" onClick={reload}>
          Try again
        </button>
      </>
    );
  }

  if (!product) {
    return <p>Product was not found</p>;
  }

  const category = product.category;

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(`/${category}`);
    }
  };

  return (
    <div className={styles.page}>
      <button type="button" className={styles.backBtn} onClick={handleBack}>
        ← Back
      </button>

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link to={`/${category}`} className={styles.breadcrumbLink}>
          {CATEGORY_LABELS[category] ?? category}
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.gallery}>
        <ul className={styles.thumbnails}>
          {product.images.map(img => (
            <li key={img}>
              <button
                type="button"
                className={
                  img === activeImage
                    ? `${styles.thumbBtn} ${styles.thumbBtnActive}`
                    : styles.thumbBtn
                }
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={product.name} />
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.mainImage}>
          <img src={activeImage || product.images[0]} alt={product.name} />
        </div>
      </div>
    </div>
  );
};
