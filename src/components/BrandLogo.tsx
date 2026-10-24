import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md', light = false }) => {
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';

  return (
    <div className={`inline-flex items-center gap-2 group cursor-pointer select-none ${className}`}>
      {/* Refined Needle & Thread Stitched Accent Icon */}
      <svg
        className={`w-6 h-6 shrink-0 transition-transform duration-300 group-hover:rotate-6 ${
          light ? 'text-[#DFD6C7]' : 'text-[#3D4E41]'
        }`}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Subtle needle */}
        <path
          d="M21 4L23 6L14 15L12 13L21 4Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        {/* Needle eye */}
        <circle cx="21.5" cy="5.5" r="0.75" fill={light ? '#181818' : '#FAF8F5'} />
        {/* Flowing stitched thread line */}
        <path
          d="M12 14C8 18 6 12 3 16C1 19 4 23 8 22C12 21 16 23 20 20"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="2.5 2"
        />
      </svg>
      <div className="flex flex-col">
        <span
          className={`font-editorial font-bold tracking-tight whitespace-nowrap leading-none ${textSize} ${
            light ? 'text-white' : 'text-[#181818]'
          }`}
        >
          StitchwellLane
        </span>
        <span
          className={`text-[9px] uppercase tracking-[0.22em] font-sans font-medium whitespace-nowrap mt-0.5 ${
            light ? 'text-[#C5BBAA]' : 'text-[#7A746B]'
          }`}
        >
          Fine Apparel · Est. 2026
        </span>
      </div>
    </div>
  );
};
