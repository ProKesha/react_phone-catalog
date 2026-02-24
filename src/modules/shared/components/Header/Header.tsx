import cn from 'classnames';
import { NavLink } from 'react-router-dom';

import styles from './Header.module.scss';

type NavLinkState = { isActive: boolean };

const NAV_LINKS = [
  { path: '/', label: 'Home', end: true },
  { path: '/phones', label: 'Phones', end: false },
  { path: '/tablets', label: 'Tablets', end: false },
  { path: '/accessories', label: 'Accessories', end: false },
];

const getNavClass = ({ isActive }: NavLinkState) =>
  cn(styles.navLink, { [styles.navLinkActive]: isActive });

const getIconClass = ({ isActive }: NavLinkState) =>
  cn(styles.iconLink, { [styles.iconLinkActive]: isActive });

// SVG path data extracted to avoid max-len lint errors in JSX attributes
const HEART_PATH =
  'M8 14S1 9.545 1 5.333C1 3.254 2.686 1.6 4.8 1.6c1.16 0 ' +
  '2.208.527 2.927 1.36A.75.75 0 0 0 8 3.28a.75.75 0 0 0 ' +
  '.273-.32C8.992 2.127 10.04 1.6 11.2 1.6 13.314 1.6 15 ' +
  '5.333 15 9.545 8 14 8 14Z';

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <div className={styles.left}>
        <NavLink to="/" className={styles.logo} aria-label="Go to home page">
          <span className={styles.logoText}>Nice Gadgets</span>
        </NavLink>

        <nav className={styles.nav}>
          {NAV_LINKS.map(({ path, label, end }) => (
            <NavLink key={path} to={path} end={end} className={getNavClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.actions}>
        <NavLink
          to="/favorites"
          className={getIconClass}
          aria-label="Favorites"
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
        </NavLink>

        <NavLink to="/cart" className={getIconClass} aria-label="Cart">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 1h1.5l1.8 8h7.4l1.3-5H4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6.5" cy="12.5" r="1" fill="currentColor" />
            <circle cx="11.5" cy="12.5" r="1" fill="currentColor" />
          </svg>
        </NavLink>
      </div>
    </div>
  </header>
);
