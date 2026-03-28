import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiTruck,
  FiShield,
  FiMessageSquare,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/cards/ProductCard";
import { useCart } from "../../context/CartContext";
import { getProductDetails } from "../../redux/actions/product";

const Stars = ({ rating }) =>
  Array.from({ length: 5 }).map((_, i) =>
    i < Math.floor(rating) ? (
      <AiFillStar key={i} size={14} className="text-emerald-300" />
    ) : (
      <AiOutlineStar key={i} size={14} className="text-white/20" />
    )
  );

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { allProducts, productDetails, productDetailsLoading } = useSelector(
    (state) => state.products
  );
  const { allShops } = useSelector((state) => state.seller);
  const product = useMemo(
    () =>
      allProducts.find((item) => item.id === id) ||
      (productDetails?.id === id ? productDetails : null),
    [allProducts, id, productDetails]
  );

  useEffect(() => {
    if (!id || product) {
      return;
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, product]);

  if (productDetailsLoading && !product) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins flex items-center justify-center">
        <p className="text-white/40 text-xl font-Playfair">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-xl font-Playfair mb-4">Product not found</p>
          <Link to="/products" className="text-emerald-300 text-sm hover:text-white transition">
            &larr; Back to products
          </Link>
        </div>
      </div>
    );
  }

  const shop =
    allShops.find((seller) => seller.id === product.shopId) || {
      id: product.shopId,
      name: product.shopName,
      handle: product.shopHandle,
      avatar: product.shopAvatar,
      description: product.shopDescription,
      followers: product.shopFollowers,
      rating: product.shopRating,
    };
  const shopProductsCount = allProducts.filter(
    (item) => item.shopId === product.shopId
  ).length;
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const gallery =
    product.gallery?.length > 0
      ? product.gallery
      : [product.image, product.image, product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleMessageSeller = () => {
    const sellerName = shop?.name || product.shopName || "seller";
    alert(`Starting a message thread with ${sellerName}.`);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition">Products</Link>
          <span>/</span>
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-white transition"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white/60 truncate">{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-[#111114]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails (same image - mock) */}
            <div className="mt-4 flex gap-3">
              {gallery.slice(0, 3).map((image, i) => (
                <div
                  key={`${product.id}-${i}`}
                  className={`h-16 w-16 rounded-xl overflow-hidden border cursor-pointer transition ${
                    i === 0 ? "border-emerald-300/50" : "border-white/10 opacity-50"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Shop + category */}
            <div className="flex items-center gap-3">
              {shop && (
                <Link to={`/shop/${shop.handle}`} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition">
                  <img src={shop.avatar} alt={shop.name} className="h-5 w-5 rounded-full" />
                  {shop.name}
                </Link>
              )}
              <span className="text-white/20">|</span>
              <span className="text-xs text-white/30">{product.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-Playfair font-semibold text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Stars rating={product.rating} />
              </div>
              <span className="text-sm text-white/70">{product.rating}</span>
              <span className="text-sm text-white/30">({product.reviews} reviews)</span>
              <span className="text-sm text-white/30">|</span>
              <span className="text-sm text-white/30">{product.sold} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-semibold text-white">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-white/30 line-through">${product.originalPrice}</span>
                  <span className="rounded-xl bg-emerald-300 px-3 py-1 text-sm font-bold text-[#0b0b0d]">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-white/60 leading-relaxed">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0 rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition text-lg"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-medium text-white">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                  added
                    ? "bg-emerald-300/20 border border-emerald-300/30 text-emerald-300"
                    : "bg-white text-[#0b0b0d] hover:-translate-y-0.5"
                }`}
              >
                <FiShoppingCart size={15} />
                {added ? "Added to cart" : "Add to Cart"}
              </button>

              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/30 transition">
                <FiHeart size={16} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: FiTruck, label: "Free shipping", sub: "Orders over $80" },
                { Icon: FiPackage, label: "Easy returns", sub: "30-day policy" },
                { Icon: FiShield, label: "Secure checkout", sub: "Encrypted payment" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Icon size={16} className="text-emerald-300" />
                  <p className="text-[10px] font-medium text-white/70">{label}</p>
                  <p className="text-[9px] text-white/30">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product details + Seller info */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#111114] p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                  Product details
                </p>
                <h2 className="text-xl font-Playfair font-semibold text-white">Full description</h2>
              </div>
              <span className="text-xs text-white/40">ID #{product.id}</span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed">
              {product.description}
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              Each item is quality-checked, ships within 2-3 business days, and is covered by a 30-day return window.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { label: "Availability", value: product.inStock ? "In stock - ready to ship" : "Currently unavailable" },
                { label: "Orders", value: `${product.sold}+ sold` },
                { label: "Category", value: product.category },
                { label: "Shipping", value: "Dispatch in 2-3 business days" },
                { label: "Returns", value: "30-day easy returns" },
                { label: "Protection", value: "Secure checkout + buyer protection" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
                  <p className="text-sm text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {product.tags?.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2">Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={shop?.avatar || product.image}
                alt={shop?.name || product.shopName}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">{shop?.name || product.shopName}</p>
                <p className="text-xs text-white/40">
                  {shop
                    ? `${shopProductsCount} products | ${shop.followers} followers`
                    : "Trusted marketplace seller"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Rating", value: `${shop?.rating || product.rating} / 5` },
                { label: "Orders", value: `${product.sold}+` },
                { label: "Category", value: product.category },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
                  <p className="text-sm text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {shop?.description && (
              <p className="text-sm text-white/60 leading-relaxed">{shop.description}</p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleMessageSeller}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-300/20 transition"
              >
                <FiMessageSquare size={15} />
                Send Message
              </button>

              <Link
                to={shop ? `/shop/${shop.handle}` : "/products"}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white text-[#0b0b0d] px-4 py-3 text-sm font-semibold hover:-translate-y-0.5 transition"
              >
                Visit Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
              Customer feedback
            </p>
            <h2 className="text-2xl font-Playfair font-semibold text-white">Reviews</h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#111114] p-8 text-center">
            <h3 className="text-2xl font-Playfair font-semibold text-white">
              No reviews yet
            </h3>
            <p className="mt-3 text-sm text-white/50">
              This product does not have a real backend review source yet, so no mock reviews are shown here.
            </p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
                You might also like
              </p>
              <h2 className="text-2xl font-Playfair font-semibold text-white">Related Products</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
