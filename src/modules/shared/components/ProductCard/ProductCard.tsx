import { Link } from 'react-router-dom';

import type { Product } from '../../types/product';
import { useCart, useFavorites } from '../../context';
import styles from './ProductCard.module.scss';

// Extracted to comply with max-len: 80 lint rule
const HEART_PATH =
  'M8 14S1 9.545 1 5.333C1 3.254 2.686 1.6 4.8 1.6c1.16 0 ' +
  '2.208.527 2.927 1.36A.75.75 0 0 0 8 3.28a.75.75 0 0 0 ' +
  '.273-.32C8.992 2.127 10.04 1.6 11.2 1.6 13.314 1.6 15 ' +
  '5.333 15 9.545 8 14 8 14Z';

type Props = {
  product: Product;
};

type SpecRowProps = {
  label: string;
  value: string;
};

const SpecRow = ({ label, value }: SpecRowProps) => (
  <div className={styles.specRow}>
    <span className={styles.specLabel}>{label}</span>
    <span className={styles.specValue}>{value}</span>
  </div>
);

export const ProductCard = ({ product }: Props) => {
  const { itemId, name, image, price, fullPrice, screen, capacity, ram } =
    product;

  const { isFavorite, toggle } = useFavorites();
  const { isInCart, add } = useCart();
  const hasDiscount = fullPrice > price;

  return (
    <article className={styles.card}>
      <Link
        to={`/product/${itemId}`}
        className={styles.imageLink}
        aria-label={name}
      >
        <img
          src={`${import.meta.env.BASE_URL}${image}`}
          alt={name}
          className={styles.image}
          loading="lazy"
        />
      </Link>

      <Link to={`/product/${itemId}`} className={styles.name}>
        {name}
      </Link>

      <div className={styles.prices}>
        <span className={styles.price}>${price}</span>
        {hasDiscount && <span className={styles.fullPrice}>${fullPrice}</span>}
      </div>

      <hr className={styles.divider} />

      <div className={styles.specs}>
        <SpecRow label="Screen" value={screen} />
        <SpecRow label="Capacity" value={capacity} />
        <SpecRow label="RAM" value={ram} />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={
            isInCart(itemId)
              ? `${styles.cartButton} ${styles.cartButtonAdded}`
              : styles.cartButton
          }
          disabled={isInCart(itemId)}
          onClick={() => add(itemId)}
        >
          {isInCart(itemId) ? 'Added to cart' : 'Add to cart'}
        </button>

        <button
          type="button"
          className={
            isFavorite(itemId)
              ? `${styles.favoriteButton} ${styles.favoriteButtonActive}`
              : styles.favoriteButton
          }
          aria-label={`Add ${name} to favorites`}
          onClick={() => toggle(itemId)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={HEART_PATH}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
};
