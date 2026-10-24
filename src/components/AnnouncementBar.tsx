import React, { useState, useEffect } from 'react';
import { X, Sparkles, Truck, Tag } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const messages = [
    {
      icon: Truck,
      text: 'Free Express Shipping Across India on Orders Above ₹1,499',
      highlight: 'Complimentary Returns Within 7 Days',
    },
    {
      icon: Tag,
      text: 'Seasonal Celebration: Flat 10% Off with Code',
      highlight: 'STITCH10',
    },
    {
      icon: Sparkles,
      text: 'New Autumn Atelier Collection Now Live',
      highlight: 'Handloom Linen & Mulberry Silks',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (dismissed) return null;

  const current = messages[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="bg-[#181818] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#2C2C2C] relative z-40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden md:block"></div>
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <IconComponent className="w-3.5 h-3.5 text-[#C4D1C6] shrink-0" />
          <span className="text-[#E0DBD0] font-normal truncate">
            {current.text}{' '}
            <strong className="font-semibold text-white tracking-wide ml-1 border-b border-[#526456]/70 pb-0.5">
              {current.highlight}
            </strong>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#9E988D] hover:text-white p-1 transition-colors"
          title="Dismiss announcement"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
