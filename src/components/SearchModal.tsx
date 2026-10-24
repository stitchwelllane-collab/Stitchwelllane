import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigate } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.fabricComposition.toLowerCase().includes(query.toLowerCase()) ||
          p.occasion.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleProductSelect = (productId: string) => {
    setIsSearchOpen(false);
    navigate('product', { productId });
  };

  const popularSearches = ['Linen Shirts', 'Pleated Trousers', 'Festive Kurta', 'Midi Dress', 'Supima Tee', 'Blazers'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border border-[#E8E2D6] w-full max-w-2xl shadow-2xl overflow-hidden rounded-lg">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E8E2D6] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#736E66] shrink-0" />
          <input
            type="text"
            placeholder="Search for linen shirts, pleated trousers, silk kurtas, dresses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#181818] placeholder-[#948D81] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#948D81] hover:text-[#181818] p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#5C574F] hover:text-[#181818] rounded-full hover:bg-[#EFE9DF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#736E66] mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 bg-[#F0EBE0] text-xs font-medium text-[#2C2B29] rounded hover:bg-[#E2DACB] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="max-h-[420px] overflow-y-auto p-4 space-y-2 divide-y divide-[#EFE9DF]">
            {results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className="pt-2 first:pt-0 flex items-center justify-between p-2 hover:bg-[#F3EFE8] cursor-pointer rounded transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-16 object-cover rounded bg-[#E8E2D6]"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#181818] group-hover:text-[#3D4E41] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#736E66] mt-0.5">
                        {product.fabricComposition} · {product.category.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-[#181818] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-[#948D81] line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#948D81] group-hover:text-[#181818] group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-[#736E66]">
                No items found for &ldquo;<span className="font-medium text-[#181818]">{query}</span>&rdquo;.
                <br />
                <span className="text-xs text-[#948D81] mt-1 inline-block">
                  Try searching for &quot;linen&quot;, &quot;trousers&quot;, &quot;kurta&quot;, or &quot;dress&quot;
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
