export const clearSellerSession = () => {
  ["sellerAuth", "sellerEmail", "sellerShopName", "sellerAvatar", "sellerId"].forEach(
    (key) => localStorage.removeItem(key)
  );
};

export const formatSellerCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
