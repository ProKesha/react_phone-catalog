import type { Product, ProductCategory } from '../types/product';
import type { ProductDetails } from '../types/productDetails';

const BASE_URL = '/api';

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to load data: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
};

export const getProducts = (): Promise<Product[]> =>
  fetchJson<Product[]>(`${BASE_URL}/products.json`);

export const getProductDetails = async (
  category: ProductCategory,
  productId: string,
): Promise<ProductDetails | null> => {
  const items = await fetchJson<ProductDetails[]>(
    `${BASE_URL}/${category}.json`,
  );

  return items.find(item => item.id === productId) ?? null;
};

export const getSuggestedProducts = async (
  currentId: string,
  category: ProductCategory,
  limit = 12,
): Promise<Product[]> => {
  const products = await getProducts();

  const pool = products.filter(
    p => p.category === category && p.itemId !== currentId,
  );

  const shuffled = [...pool];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
};
