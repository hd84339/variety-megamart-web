import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNER_BASE_URL = "https://project.varietymegastore.com/uploads/banner/";

const HeroSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full px-4 md:px-8 pt-6 pb-2">
      <div className="relative overflow-hidden group h-[250px] md:h-[500px] lg:h-[600px] rounded-3xl shadow-2xl border-4 border-white">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((item, index) => {
            console.log(`BANNER ${index} DATA:`, item);
            const rawImage = item.image || item.banner || item.file || item.latest_image?.image;
            const imageUrl = rawImage?.startsWith("http") 
              ? rawImage 
              : `${BANNER_BASE_URL}${rawImage}`;
              
            return (
              <div key={index} className="min-w-full h-full relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Banner ${index + 1}`}
                  className={`w-full h-full object-cover transition-all duration-[8000ms] ease-linear ${
                    currentIndex === index ? "scale-110" : "scale-100"
                  }`}
                  onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = "https://via.placeholder.com/1200x600?text=MegaMart+Premium+Collection";
                  }}
                />
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                
                {/* Banner Content (Optional but adds to the look) */}
                <div className="absolute bottom-12 left-12 text-white max-w-[500px] hidden md:block animate-fade-in">
                  <h2 className="text-4xl font-black mb-4 drop-shadow-lg uppercase tracking-tighter italic">
                    Exclusive Selection
                  </h2>
                  <p className="text-lg font-medium text-white/90 drop-shadow-md">
                    Discover the latest trends in premium lifestyle and technology.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer z-20 border-none shadow-lg"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white text-white hover:text-black w-14 h-14 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer z-20 border-none shadow-lg"
        >
          <ChevronRight size={32} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 border-none cursor-pointer ${
                currentIndex === index ? "bg-white w-12 shadow-md" : "bg-white/40 w-4 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;