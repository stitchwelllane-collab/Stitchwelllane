import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ShopByCategory: React.FC = () => {
  const { navigate, setShopFilters } = useShop();

  const categories = [
    {
      id: 'mens',
      title: "Men's Clothing",
      subtitle: 'Tailored shirts, trousers & jackets',
      image: '/src/assets/images/collection_mens_tailored_1792179896681.jpg',
      gender: 'men',
      category: 'all',
    },
    {
      id: 'womens',
      title: "Women's Clothing",
      subtitle: 'Draped dresses, linen trousers & silhouettes',
      image: '/src/assets/images/collection_womens_contemporary_1792179896644.jpg',
      gender: 'women',
      category: 'all',
    },
    {
      id: 'shirts',
      title: 'Shirts & Overshirts',
      subtitle: 'Normandy linen & selvedge cotton',
      image: '/src/assets/images/product_linen_shirt_1792179970375.jpg',
      category: 'shirts',
    },
    {
      id: 'dresses',
      title: 'Dresses & Co-ords',
      subtitle: 'Fluid silk & textured modal',
      image: '/src/assets/images/collection_womens_contemporary_1792179896644.jpg',
      category: 'dresses',
      gender: 'women',
    },
    {
      id: 'trousers',
      title: 'Trousers & Pleated Bottoms',
      subtitle: 'Merino wool blends & wide leg fits',
      image: '/src/assets/images/product_charcoal_trousers_1792179972104.jpg',
      category: 'trousers',
    },
    {
      id: 'ethnic',
      title: 'Festive & Ethnic Wear',
      subtitle: 'Raw silk kurtas & hand-embroidered details',
      image: '/src/assets/images/product_chanderi_kurta_1792179970068.jpg',
      category: 'ethnic',
    },
    {
      id: 'tshirts',
      title: 'T-Shirts & Tops',
      subtitle: 'Heavyweight 260 GSM Supima cotton',
      image: '/src/assets/images/product_supima_tee_1792179970901.jpg',
      category: 'tshirts',
    },
    {
      id: 'jackets',
      title: 'Jackets & Outerwear',
      subtitle: 'Unstructured blazers & safari jackets',
      image: '/src/assets/images/hero_fashion_editorial_1792179895668.jpg',
      category: 'jackets',
    },
  ];

  const handleSelect = (cat: typeof categories[0]) => {
    setShopFilters((prev) => ({
      ...prev,
      category: cat.category || 'all',
      gender: cat.gender || 'all',
      occasion: 'all',
      isBestSeller: false,
      isNewArrival: false,
    }));
    navigate('shop');
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E2D6]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3D4E41]">
            Curated Wardrobes
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#181818] mt-1">
            Shop by Category
          </h2>
        </div>
        <p className="text-sm text-[#666056] max-w-md mt-2 md:mt-0">
          Engineered for everyday versatility with natural breathable textiles tailored for Indian weather.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat)}
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#EFE9DF] border border-[#E0D8CB] transition-all duration-300 hover:shadow-md"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            {/* Subtle Gradient & Category Label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-editorial font-bold text-white group-hover:text-[#F3EFE8] transition-colors leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#D5CEBF] line-clamp-1 mt-0.5 font-sans">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[#181818] text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
