import { products } from "./mockData";

const SELLER_CREATED_PRODUCTS_KEY = "sellerCreatedProducts";

const readStoredProducts = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SELLER_CREATED_PRODUCTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredProducts = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SELLER_CREATED_PRODUCTS_KEY,
    JSON.stringify(items)
  );
};

export const getStoredSellerProducts = () => readStoredProducts();

export const createStoredSellerProduct = (product) => {
  const current = readStoredProducts();
  const next = [product, ...current];
  writeStoredProducts(next);
  return product;
};

export const getCatalogProducts = () => [
  ...readStoredProducts(),
  ...products,
];

export const getCatalogProductById = (id) =>
  getCatalogProducts().find((product) => product.id === Number(id));

export const getCatalogProductsByShopId = (shopId) =>
  getCatalogProducts().filter((product) => product.shopId === shopId);
