import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const ProductListing: React.FC = () => {
  const { products, shopFilters, setShopFilters } = useShop();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Selected local filter facets
  const [selectedGender, setSelectedGender] = useState<string>(shopFilters.gender || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(shopFilters.category || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>(shopFilters.occasion || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>(shopFilters.sort || 'featured');

  // Sync when parent shopFilters change (e.g. from nav clicks)
  React.useEffect(() => {
    if (shopFilters.gender !== undefined) setSelectedGender(shopFilters.gender);
    if (shopFilters.category !== undefined) setSelectedCategory(shopFilters.category);
    if (shopFilters.occasion !== undefined) setSelectedOccasion(shopFilters.occasion);
    if (shopFilters.sort !== undefined) setSortBy(shopFilters.sort);
  }, [shopFilters]);

  // Derived filter options
  const materials = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.material) set.add(p.material);
    });
    return Array.from(set);
  }, [products]);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38 (S)', '40 (M)', '42 (L)'];

  // Filter pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Gender filter
      if (selectedGender !== 'all') {
        if (selectedGender === 'men' && p.gender !== 'men' && p.gender !== 'unisex') return false;
        if (selectedGender === 'women' && p.gender !== 'women' && p.gender !== 'unisex') return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Occasion filter
      if (selectedOccasion !== 'all' && p.occasion !== selectedOccasion) return false;

      // Flags
      if (shopFilters.isBestSeller && !p.isBestSeller) return false;
      if (shopFilters.isNewArrival && !p.isNewArrival) return false;

      // Price filter
      if (p.price < minPrice || p.price > maxPrice) return false;

      // Material
      if (selectedMaterial !== 'all' && p.material !== selectedMaterial) return false;

      // Size
      if (selectedSize !== 'all') {
        const hasSize = p.sizes.some((s) => s.size === selectedSize && s.stock > 0);
        if (!hasSize) return false;
      }

      // In stock
      if (inStockOnly) {
        const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
        if (totalStock <= 0) return false;
      }

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      return true;
    });
  }, [
    products,
    selectedGender,
    selectedCategory,
    selectedOccasion,
    selectedMaterial,
    selectedSize,
    minPrice,
    maxPrice,
    inStockOnly,
    minRating,
    shopFilters,
  ]);

  // Sort pipeline
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else {
      // Default featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const resetFilters = () => {
    setSelectedGender('all');
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setSelectedSize('all');
    setSelectedMaterial('all');
    setMinPrice(0);
    setMaxPrice(15000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('featured');
    setShopFilters({ category: 'all', gender: 'all', occasion: 'all' });
  };

  // Title generator
  const getPageTitle = () => {
    if (shopFilters.isBestSeller) return 'Best Sellers Collection';
    if (shopFilters.isNewArrival) return 'New Arrivals 2026';
    if (selectedGender === 'men') return "Men's Collection";
    if (selectedGender === 'women') return "Women's Collection";
    if (selectedCategory !== 'all') {
      return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }
    return 'Complete Wardrobe';
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header & Breadcrumbs */}
      <div className="pb-6 border-b border-[#E8E2D6] mb-8">
        <div className="flex items-center gap-2 text-xs text-[#736E66] mb-2 font-medium">
          <span>Home</span>
          <span>/</span>
          <span>Catalog</span>
          <span>/</span>
          <span className="text-[#181818] font-semibold">{getPageTitle()}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818]">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-[#666056] mt-1">
              Showing {sortedProducts.length} premium handcrafted garments · Pure Indian & imported natural textiles
            </p>
          </div>

          {/* Controls: Filter Drawer Toggle & Sort */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 bg-white border border-[#D5CBB9] rounded text-xs font-semibold text-[#181818] flex items-center gap-2 hover:bg-[#F3EFE8]"
            >
              <Filter className="w-3.5 h-3.5 text-[#3D4E41]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-[#D5CBB9] rounded px-3 py-1.5 text-xs text-[#181818]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#666056]" />
              <label htmlFor="sort-select" className="text-[#666056] hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High (₹)</option>
                <option value="price_desc">Price: High to Low (₹)</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-[#FAF8F5] p-6 overflow-y-auto block'
              : 'hidden'
          } lg:static lg:bg-transparent lg:p-0 space-y-6`}
        >
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] lg:hidden mb-4">
              <span className="font-editorial text-lg font-bold text-[#181818]">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#181818] hover:bg-[#EFE9DF] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <span className="text-xs font-bold tracking-wider uppercase text-[#181818] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#3D4E41]" />
              Refine By
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-[#888073] hover:text-[#181818] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
              Gender
            </h4>
            <div className="space-y-1.5 text-xs text-[#524E47]">
              {['all', 'men', 'women'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-[#181818]">
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === g}
                    onChange={() => setSelectedGender(g)}
                    className="accent-[#3D4E41]"
                  />
                  <span className="capitalize">{g === 'all' ? 'All Genders' : g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2 pt-4 border-t border-[#E8E2D6]">
            <h4 className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
              Category
            </h4>
            <div className="space-y-1.5 text-xs text-[#524E47]">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'shirts', label: 'Shirts & Overshirts' },
                { id: 'trousers', label: 'Trousers & Pants' },
                { id: 'dresses', label: 'Dresses & Midi' },
                { id: 'ethnic', label: 'Ethnic & Festive Kurtas' },
                { id: 'tshirts', label: 'Supima T-Shirts' },
                { id: 'jackets', label: 'Blazers & Outerwear' },
              ].map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:text-[#181818]">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === c.id}
                    onChange={() => setSelectedCategory(c.id)}
                    className="accent-[#3D4E41]"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-4 border-t border-[#E8E2D6]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
                Price (INR ₹)
              </h4>
              <span className="text-xs font-mono font-semibold text-[#3D4E41] tabular-nums">
                Up to ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#3D4E41] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#888073]">
              <span>₹1,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-4 border-t border-[#E8E2D6]">
            <h4 className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
              Available Sizes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  selectedSize === 'all'
                    ? 'bg-[#181818] text-white border-[#181818]'
                    : 'bg-white text-[#524E47] border-[#D5CBB9] hover:border-[#181818]'
                }`}
              >
                All
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    selectedSize === s
                      ? 'bg-[#181818] text-white border-[#181818]'
                      : 'bg-white text-[#524E47] border-[#D5CBB9] hover:border-[#181818]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          {materials.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#E8E2D6]">
              <h4 className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
                Fabric Material
              </h4>
              <div className="space-y-1.5 text-xs text-[#524E47]">
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#181818]">
                  <input
                    type="radio"
                    name="material"
                    checked={selectedMaterial === 'all'}
                    onChange={() => setSelectedMaterial('all')}
                    className="accent-[#3D4E41]"
                  />
                  <span>All Materials</span>
                </label>
                {materials.map((mat) => (
                  <label key={mat} className="flex items-center gap-2 cursor-pointer hover:text-[#181818]">
                    <input
                      type="radio"
                      name="material"
                      checked={selectedMaterial === mat}
                      onChange={() => setSelectedMaterial(mat)}
                      className="accent-[#3D4E41]"
                    />
                    <span>{mat}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* In Stock & Ratings */}
          <div className="space-y-3 pt-4 border-t border-[#E8E2D6]">
            <label className="flex items-center gap-2 text-xs text-[#181818] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#3D4E41]"
              />
              <span>In Stock Only</span>
            </label>

            <div>
              <span className="text-xs font-semibold text-[#181818] block mb-1">
                Minimum Rating
              </span>
              <div className="flex items-center gap-2">
                {[0, 4.0, 4.5, 4.8].map((rat) => (
                  <button
                    key={rat}
                    onClick={() => setMinRating(rat)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      minRating === rat
                        ? 'bg-[#3D4E41] text-white border-[#3D4E41]'
                        : 'bg-white text-[#524E47] border-[#D5CBB9]'
                    }`}
                  >
                    {rat === 0 ? 'Any' : `${rat}+ ★`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {mobileFilterOpen && (
            <div className="pt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded"
              >
                Apply Filters ({filteredProducts.length} Items)
              </button>
            </div>
          )}
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < sortedProducts.length && (
                <div className="mt-12 text-center pt-6 border-t border-[#E8E2D6]">
                  <p className="text-xs text-[#736E66] mb-3">
                    Showing {displayedProducts.length} of {sortedProducts.length} designs
                  </p>
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-8 py-3 bg-white text-[#181818] border border-[#181818] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#181818] hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    Load More Designs
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-white rounded-lg border border-[#E8E2D6] p-8">
              <h3 className="text-xl font-editorial font-bold text-[#181818]">
                No garments matched your criteria
              </h3>
              <p className="text-xs text-[#666056] mt-2 max-w-md mx-auto">
                Try widening your price range, clearing specific size selections, or resetting filters to browse our full atelier collection.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-5 py-2.5 bg-[#181818] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#2C2C2C] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
