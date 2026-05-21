import React, { useState } from "react";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const ImageShowcase = ({ product, title }) => {
  const images = [];
  
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => images.push(img.image || img.file));
  } else if (product.latest_image?.image) {
    images.push(product.latest_image.image);
  } else if (product.product?.image) {
    images.push(product.product.image);
  } else if (product.variation?.image) {
    images.push(product.variation.image);
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getImageUrl = (img) => {
    if (!img) return PLACEHOLDER_IMAGE;
    if (img.startsWith('http')) return img;
    return `${IMAGE_BASE_URL}${img}`;
  };

  const currentImage = images.length > 0 ? getImageUrl(images[selectedImageIndex]) : PLACEHOLDER_IMAGE;

  return (
    <div className="md:sticky md:top-[100px] flex flex-col gap-4">
      {/* Main Image */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <img
          src={currentImage}
          alt={title}
          className="w-full aspect-square object-contain rounded-2xl"
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, index) => (
            <button 
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                selectedImageIndex === index ? "border-[#E60023] shadow-md" : "border-gray-100 opacity-70 hover:opacity-100"
              }`}
            >
              <img 
                src={getImageUrl(img)} 
                alt={`${title} thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageShowcase;
