import { type ChangeEvent, useEffect, useState } from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import cn from 'classnames';

import { useDebounce } from '../../hooks/useDebounce';
import { useCart, useFavorites } from '../../context';
import styles from './Header.module.scss';

type NavLinkState = { isActive: boolean };

const NAV_LINKS = [
  { path: '/', label: 'Home', end: true },
  { path: '/phones', label: 'Phones', end: false },
  { path: '/tablets', label: 'Tablets', end: false },
  { path: '/accessories', label: 'Accessories', end: false },
];

// Маршрути де показується пошуковий рядок
const SEARCH_ROUTES = ['/phones', '/tablets', '/accessories', '/favorites'];

const SEARCH_PLACEHOLDER: Record<string, string> = {
  '/phones': 'Search in Phones...',
  '/tablets': 'Search in Tablets...',
  '/accessories': 'Search in Accessories...',
  '/favorites': 'Search in Favorites...',
};

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

// Shopping bag: handle arch + body
const BAG_HANDLE = 'M5.5 6.5V5a2.5 2.5 0 0 1 5 0v1.5';
const BAG_BODY = 'M2.5 6.5h11v6.5a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V6.5z';

const SEARCH_PATH =
  'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06' +
  '.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 ' +
  '1 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0';

const HAMBURGER_PATH = 'M1 3h14M1 8h14M1 13h14';
const CLOSE_PATH = 'M2 2l12 12M14 2L2 14';

const getMobileNavClass = ({ isActive }: NavLinkState) =>
  cn(styles.mobileNavLink, { [styles.mobileNavLinkActive]: isActive });

const getMobileIconClass = ({ isActive }: NavLinkState) =>
  cn(styles.mobileIconLink, { [styles.mobileIconLinkActive]: isActive });

export const Header = () => {
  const { favoritesCount } = useFavorites();
  const { getTotalQuantity } = useCart();
  const cartCount = getTotalQuantity();

  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const showSearch = SEARCH_ROUTES.includes(pathname);
  const placeholder = SEARCH_PLACEHOLDER[pathname] ?? 'Search...';

  // Беремо поточне значення query з URL як початковий стан
  const urlQuery = searchParams.get('query') ?? '';
  const [inputValue, setInputValue] = useState(urlQuery);
  const debouncedValue = useDebounce(inputValue, 300);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // При переході на іншу сторінку — синхронізуємо input і закриваємо меню
  useEffect(() => {
    setInputValue(searchParams.get('query') ?? '');
    setIsMenuOpen(false);
    // тут навмисно не додаємо searchParams у deps —
    // ефект потрібен тільки при зміні pathname
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Після debounce — записуємо query в URL
  useEffect(() => {
    if (!showSearch) {
      return;
    }

    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev);

        if (debouncedValue) {
          next.set('query', debouncedValue);
        } else {
          next.delete('query');
        }

        return next;
      },
      { replace: true },
    );
  }, [debouncedValue, setSearchParams, showSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => setInputValue('');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <NavLink to="/" className={styles.logo} aria-label="Go to home page">
            <span className={styles.logoText}>
              Nice <span className={styles.logoIcon}>👌</span>
              <br />
              Gadgets
            </span>
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
          {showSearch && (
            <div className={styles.search}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d={SEARCH_PATH} fill="currentColor" />
              </svg>

              <input
                type="search"
                className={styles.searchInput}
                value={inputValue}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label="Search products"
              />

              {inputValue && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <NavLink
            to="/favorites"
            className={getIconClass}
            aria-label="Favorites"
          >
            {favoritesCount > 0 && (
              <span className={styles.badge}>{favoritesCount}</span>
            )}
            <svg
              width="20"
              height="20"
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
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d={BAG_HANDLE}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={BAG_BODY}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </NavLink>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={toggleMenu}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d={isMenuOpen ? CLOSE_PATH : HAMBURGER_PATH}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {NAV_LINKS.map(({ path, label, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                className={getMobileNavClass}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.mobileActions}>
            <NavLink
              to="/favorites"
              className={getMobileIconClass}
              aria-label="Favorites"
              onClick={closeMenu}
            >
              {favoritesCount > 0 && (
                <span className={styles.badge}>{favoritesCount}</span>
              )}
              <svg
                width="20"
                height="20"
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

            <NavLink
              to="/cart"
              className={getMobileIconClass}
              aria-label="Cart"
              onClick={closeMenu}
            >
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d={BAG_HANDLE}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={BAG_BODY}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};
