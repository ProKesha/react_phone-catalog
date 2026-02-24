import styles from './Footer.module.scss';

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <span className={styles.logo}>Nice Gadgets</span>

      <nav className={styles.nav} aria-label="Footer navigation">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Github
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Contacts
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Rights
        </a>
      </nav>

      <button
        type="button"
        className={styles.backToTop}
        onClick={handleScrollToTop}
        aria-label="Back to top"
      >
        <span className={styles.backToTopText}>Back to top</span>
        <span className={styles.backToTopIcon} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 12V4M4 8l4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  </footer>
);
