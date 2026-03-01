import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  getProductDetails,
  getProducts,
  getSuggestedProducts,
} from '../shared/api/apiClient';
import { useAsync } from '../shared/hooks/useAsync';
import { Loader } from '../shared/components/Loader';
import { ProductCard } from '../shared/components/ProductCard';
import type { ProductDetails } from '../shared/types/productDetails';
import styles from './ProductDetailsPage.module.scss';

const CATEGORY_LABELS: Record<string, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

const COLOR_MAP: Record<string, string> = {
  midnight: '#1F2020',
  starlight: '#F2E8D9',
  purple: '#B9A2C7',
  yellow: '#FAE04C',
  green: '#3D6B54',
  blue: '#276787',
  red: '#BF0000',
  black: '#1B1B1B',
  white: '#F5F5F0',
  pink: '#F9C0BB',
  spaceblack: '#403E3D',
  spacegray: '#57595D',
  silver: '#CBCBCB',
  gold: '#F9E4C8',
  graphite: '#54524F',
  sierrablue: '#A7C1D9',
  alpinegreen: '#576856',
  skyblue: '#8AB4C8',
  rosegold: '#E8BCAC',
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

  const fetchSuggested = useCallback(async () => {
    if (!product) {
      return [];
    }

    return getSuggestedProducts(productId, product.category);
  }, [product, productId]);

  const { data: suggested, loading: suggestedLoading } =
    useAsync(fetchSuggested);

  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.images[0]);
      setSelectedColor(product.colorsAvailable[0]);
      setSelectedCapacity(product.capacityAvailable[0]);
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

      <div className={styles.selectors}>
        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>Available colors</p>
          <ul className={styles.colorList}>
            {product.colorsAvailable.map(color => (
              <li key={color}>
                <input
                  id={`color-${color}`}
                  type="radio"
                  name="product-color"
                  value={color}
                  checked={color === selectedColor}
                  onChange={() => setSelectedColor(color)}
                  className={styles.colorInput}
                />
                <label
                  htmlFor={`color-${color}`}
                  className={styles.colorBtn}
                  style={{
                    backgroundColor: COLOR_MAP[color] ?? '#ccc',
                  }}
                >
                  <span className="visually-hidden">{color}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.selectorGroup}>
          <p className={styles.selectorLabel}>Select capacity</p>
          <ul className={styles.capacityList}>
            {product.capacityAvailable.map(cap => (
              <li key={cap}>
                <input
                  id={`capacity-${cap}`}
                  type="radio"
                  name="product-capacity"
                  value={cap}
                  checked={cap === selectedCapacity}
                  onChange={() => setSelectedCapacity(cap)}
                  className={styles.capacityInput}
                />
                <label
                  htmlFor={`capacity-${cap}`}
                  className={styles.capacityBtn}
                >
                  {cap}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
                <img
                  src={`${import.meta.env.BASE_URL}${img}`}
                  alt={product.name}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.mainImage}>
          <img
            src={`${import.meta.env.BASE_URL}${activeImage || product.images[0]}`}
            alt={product.name}
          />
        </div>
      </div>

      <section className={styles.about}>
        <h2 className={styles.aboutTitle}>About</h2>
        {product.description.map(section => (
          <div key={section.title} className={styles.aboutSection}>
            <h3 className={styles.aboutSectionTitle}>{section.title}</h3>
            {section.text.map(paragraph => (
              <p key={paragraph} className={styles.aboutText}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </section>

      <section className={styles.techSpecs}>
        <h2 className={styles.techSpecsTitle}>Tech specs</h2>
        {[
          { label: 'Screen', value: product.screen },
          { label: 'Resolution', value: product.resolution },
          { label: 'Processor', value: product.processor },
          { label: 'RAM', value: product.ram },
          { label: 'Capacity', value: product.capacity },
          ...(product.camera
            ? [{ label: 'Camera', value: product.camera }]
            : []),
          ...(product.zoom ? [{ label: 'Zoom', value: product.zoom }] : []),
          { label: 'Cell', value: product.cell.join(', ') },
        ].map(({ label, value }) => (
          <div key={label} className={styles.specRow}>
            <span className={styles.specLabel}>{label}</span>
            <span className={styles.specValue}>{value}</span>
          </div>
        ))}
      </section>

      <section className={styles.suggested}>
        <h2 className={styles.suggestedTitle}>You may also like</h2>
        {suggestedLoading && <Loader />}
        {!suggestedLoading && suggested && (
          <ul className={styles.suggestedList}>
            {suggested.map(item => (
              <li key={item.itemId} className={styles.suggestedItem}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
