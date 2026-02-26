import { Link } from 'react-router-dom';

import styles from './ShopByCategory.module.scss';

const CATEGORIES = [
  {
    title: 'Mobile phones',
    image: '/img/category-phones.webp',
    to: '/phones',
  },
  {
    title: 'Tablets',
    image: '/img/category-tablets.webp',
    to: '/tablets',
  },
  {
    title: 'Accessories',
    image: '/img/category-accessories.webp',
    to: '/accessories',
  },
];

export const ShopByCategory = () => (
  <ul className={styles.grid}>
    {CATEGORIES.map(({ title, image, to }) => (
      <li key={to}>
        <Link to={to} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src={image} alt={title} className={styles.image} />
          </div>
          <p className={styles.title}>{title}</p>
        </Link>
      </li>
    ))}
  </ul>
);
