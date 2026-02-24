import type { ProductCategory } from './product';

export type ProductDescription = {
  title: string;
  text: string[];
};

// All three categories share the same detail shape.
// `camera` and `zoom` are absent in accessories — marked optional.
export type ProductDetails = {
  id: string;
  category: ProductCategory;
  namespaceId: string;
  name: string;
  capacityAvailable: string[];
  capacity: string;
  priceRegular: number;
  priceDiscount: number;
  colorsAvailable: string[];
  color: string;
  images: string[];
  description: ProductDescription[];
  screen: string;
  resolution: string;
  processor: string;
  ram: string;
  camera?: string;
  zoom?: string;
  cell: string[];
};
