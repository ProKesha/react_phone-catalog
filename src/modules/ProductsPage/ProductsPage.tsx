type Category = 'phones' | 'tablets' | 'accessories';

type Props = {
  category: Category;
};

const TITLES: Record<Category, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  accessories: 'Accessories',
};

export const ProductsPage = ({ category }: Props) => (
  <>
    <h1>{TITLES[category]}</h1>
    <p>{TITLES[category]} page — coming soon</p>
  </>
);
