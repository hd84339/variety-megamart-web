import React from "react";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const ImageShowcase = ({ product, title }) => {
  const rawImage = product.image ||
    (product.images && product.images.length > 0 ? (product.images[0].image || product.images[0].file) : null) ||
    product.latest_image?.image ||
    product.product?.image ||
    product.product?.latest_image?.image ||
    product.variation?.image ||
    product.variation?.latest_image?.image;

  const imageUrl = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE_URL}${rawImage}`)
    : PLACEHOLDER_IMAGE;

  return (
    <div className="md:sticky md:top-[100px] bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <img
        src={imageUrl}
        alt={title}
        className="w-full aspect-square object-contain rounded-2xl"
      />
    </div>
  );
};

export default ImageShowcase;
