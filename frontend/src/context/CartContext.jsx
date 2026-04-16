import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { resolveAvailableStock } from "../utils/marketplace";

const CartContext = createContext(null);

const getItemId = (itemOrId) =>
  typeof itemOrId === "object" && itemOrId !== null
    ? itemOrId.id || itemOrId._id || ""
    : itemOrId || "";

const getItemStock = (item) => {
  return resolveAvailableStock(item);
};

const getStockLimitMessage = (stock, currentQty = 0) => {
  const remaining = Math.max(stock - currentQty, 0);

  if (stock <= 0) {
    return "This product is sold out.";
  }

  if (remaining <= 0) {
    return "Stock is limited. You already have the maximum available quantity in your cart.";
  }

  if (remaining === 1) {
    return "Stock is limited. Only 1 more item can be added.";
  }

  return `Stock is limited. Only ${remaining} more items can be added.`;
};

const normalizeCartItem = (item, qty = 1) => {
  const id = getItemId(item);
  const stock = getItemStock(item);
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
    qty,
  };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed)
        ? parsed
            .map((item) =>
              normalizeCartItem(item, Math.max(1, Number(item?.qty) || 1))
            )
            .filter((item) => item.id)
        : [];
    } catch (error) {
      return [];
    }
  });
  const cartItemsRef = useRef(cartItems);

  useEffect(() => {
    cartItemsRef.current = cartItems;
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const normalizedProduct = normalizeCartItem(
      product,
      Math.max(1, Number(quantity) || 1)
    );
    const stock = getItemStock(normalizedProduct);

    if (!normalizedProduct.id) {
      return {
        success: false,
        message: "Product could not be added to the cart.",
      };
    }

    if (stock <= 0) {
      return {
        success: false,
        message: "This product is sold out.",
      };
    }

    const currentItems = cartItemsRef.current;
    const existing = currentItems.find(
      (item) => getItemId(item) === normalizedProduct.id
    );
    const nextQty = (existing?.qty || 0) + normalizedProduct.qty;

    if (nextQty > stock) {
      return {
        success: false,
        message: getStockLimitMessage(stock, existing?.qty || 0),
      };
    }

    const nextItems = existing
      ? currentItems.map((item) =>
          getItemId(item) === normalizedProduct.id
            ? {
                ...item,
                ...normalizedProduct,
                qty: item.qty + normalizedProduct.qty,
              }
            : item
        )
      : [...currentItems, normalizedProduct];

    cartItemsRef.current = nextItems;
    setCartItems(nextItems);

    return {
      success: true,
      message: "Added to cart.",
    };
  };

  const removeFromCart = (itemOrId) => {
    const id = getItemId(itemOrId);
    const nextItems = cartItemsRef.current.filter((item) => getItemId(item) !== id);

    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  const updateQty = (itemOrId, qty) => {
    const id = getItemId(itemOrId);

    if (qty < 1) {
      removeFromCart(itemOrId);
      return;
    }

    const nextItems = cartItemsRef.current.map((item) => {
      if (getItemId(item) !== id) {
        return item;
      }

      const stock = getItemStock(item);
      const nextQty = stock > 0 ? Math.min(qty, stock) : qty;

      return {
        ...item,
        qty: Math.max(1, nextQty),
      };
    });

    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  const clearCart = () => {
    cartItemsRef.current = [];
    setCartItems([]);
  };
  const isInCart = (itemOrId) =>
    cartItems.some((item) => getItemId(item) === getItemId(itemOrId));
  const getCartItemQty = (itemOrId) =>
    cartItems.find((item) => getItemId(item) === getItemId(itemOrId))?.qty || 0;

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isInCart,
        getCartItemQty,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
