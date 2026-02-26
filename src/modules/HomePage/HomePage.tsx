import { PicturesSlider } from '../shared/components/PicturesSlider';
import styles from './HomePage.module.scss';

export const HomePage = () => (
  <div className={styles.page}>
    <h1 className="visually-hidden">Product Catalog</h1>

    {/* ── 1. Pictures slider ───────────────────────────────────────────── */}
    <section className={styles.picturesSlider} aria-label="Featured products">
      <PicturesSlider />
    </section>

    <div className={styles.container}>
      {/* ── 2. Hot prices ──────────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="hot-prices-title">
        <h2 id="hot-prices-title" className={styles.sectionTitle}>
          Hot prices
        </h2>

        {/* ProductsSlider — hot prices */}
      </section>

      {/* ── 3. Shop by category ────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="categories-title">
        <h2 id="categories-title" className={styles.sectionTitle}>
          Shop by category
        </h2>

        {/* ShopByCategory component */}
      </section>

      {/* ── 4. Brand new ───────────────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="brand-new-title">
        <h2 id="brand-new-title" className={styles.sectionTitle}>
          Brand new
        </h2>

        {/* ProductsSlider — brand new */}
      </section>
    </div>
  </div>
);
