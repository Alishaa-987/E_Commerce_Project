import React, { createContext, useContext, useEffect, useState } from "react";
import { resolveAvailableStock } from "../utils/marketplace";

const WishlistContext = createContext(null);

const getItemId = (itemOrId) =>
  typeof itemOrId === "object" && itemOrId !== null
    ? itemOrId.id || itemOrId._id || ""
    : itemOrId || "";

const normalizeWishlistItem = (item) => {
  const id = getItemId(item);
  const stock = resolveAvailableStock(item);
  const sold = Number(item?.sold_out ?? item?.sold);
  const rawStock = Number(item?.stock);
  const totalStock = Number(item?.totalStock);
  const normalizedTotalStock = Number.isFinite(totalStock)
    ? totalStock
    : Number.isFinite(rawStock) && Number.isFinite(sold) && sold > 0 && rawStock >= sold
      ? rawStock
      : stock;

  return {
    ...item,
    id,
    _id: item?._id || id,
    totalStock: normalizedTotalStock,
    availableStock: stock,
    stock,
  };
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed)
        ? parsed.map(normalizeWishlistItem).filter((item) => item.id)
        : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const normalizedProduct = normalizeWishlistItem(product);

    if (!normalizedProduct.id) {
      return false;
    }

    setWishlist((prev) => {
      const exists = prev.some((item) => getItemId(item) === normalizedProduct.id);

      if (exists) {
        return prev.filter((item) => getItemId(item) !== normalizedProduct.id);
      }

      return [...prev, normalizedProduct];
    });

    return true;
  };

  const isWishlisted = (itemOrId) => {
    const id = getItemId(itemOrId);

    return wishlist.some((item) => getItemId(item) === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
