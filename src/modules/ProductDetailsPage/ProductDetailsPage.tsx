import { useParams } from 'react-router-dom';

export const ProductDetailsPage = () => {
  const { productId } = useParams();

  return (
    <>
      <h1>Product Details</h1>
      <p>Product ID: {productId}</p>
    </>
  );
};
