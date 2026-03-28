import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/cards/ProductCard";
import { deriveCategories } from "../../utils/marketplace";

const sortOptions = [
  { label: "Newest", value: "new" },
  { label: "Price: Low -> High", value: "price-asc" },
  { label: "Price: High -> Low", value: "price-desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Best Seller", value: "bestseller" },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("new");
  const [priceMax, setPriceMax] = useState(600);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { allProducts, allProductsLoading } = useSelector((state) => state.products);

  const activeCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const categories = useMemo(() => deriveCategories(allProducts), [allProducts]);

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shopName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result = result.filter((p) => p.price <= priceMax);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "bestseller":
        result.sort((a, b) => b.sold - a.sold);
        break;
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [activeCategory, searchQuery, sort, priceMax, allProducts]);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          Category
        </p>
        <div className="space-y-1">
          <button
            onClick={() => setCategory("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              !activeCategory
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                activeCategory === cat.name
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-white/30">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          Max Price
        </p>
        <div className="space-y-3">
          <input
            type="range"
            min={20}
            max={600}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-emerald-300"
          />
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>$20</span>
            <span className="text-white font-medium">${priceMax}</span>
            <span>$600</span>
          </div>
        </div>
      </div>

      {/* In stock */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          Availability
        </p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-300"
          />
          <span className="text-sm text-white/60">In stock only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white font-Poppins">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
            {activeCategory || "All"} | {filteredProducts.length} results
          </p>
          <h1 className="text-3xl font-Playfair font-semibold text-white">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory
              ? activeCategory
              : "All Products"}
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition lg:hidden"
          >
            <FiFilter size={14} /> Filters
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-white/30 hidden sm:block">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111114] px-3 py-2 text-sm text-white/70 outline-none focus:border-white/30"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {allProductsLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-white/40 text-lg font-Playfair">Loading products</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <FiSearch size={40} className="text-white/20 mb-4" />
                <p className="text-white/40 text-lg font-Playfair">
                  No products found
                </p>
                <p className="text-white/30 text-sm mt-1">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative ml-auto w-72 h-full bg-[#111114] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-white">Filters</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductsPage;
