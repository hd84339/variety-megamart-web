import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const title = item.title ||
    item.name ||
    item.product?.title ||
    item.product?.name ||
    item.variation?.title ||
    "Product";

  const rawImage = item.image ||
    item.latest_image?.image ||
    item.product?.image ||
    item.product?.latest_image?.image ||
    item.variation?.image ||
    item.variation?.latest_image?.image;

  const imageUrl = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE_URL}${rawImage}`)
    : PLACEHOLDER_IMAGE;

  const price = item.price ||
    item.active_price?.price ||
    item.variation?.price ||
    item.variation?.active_price?.price ||
    item.product?.price ||
    0;

  const mrp = item.mrp ||
    item.active_price?.mrp ||
    item.variation?.mrp ||
    item.variation?.active_price?.mrp ||
    item.product?.mrp ||
    price;

  return (
    <div className="flex bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
      <img
        src={imageUrl}
        alt={title}
        className="w-[120px] h-[120px] object-cover rounded-xl bg-gray-50"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />
      <div className="flex-1 ml-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-semibold mb-1 leading-tight">{title}</h4>
            <div className="text-[0.85rem] text-gray-500">
              {item.variant_name || item.variation?.name || "Standard Edition"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#E60023]">₹{price}</div>
            {mrp > price && (
              <div className="text-[0.8rem] text-gray-400 line-through">
                ₹{mrp}
              </div>
            )}
            <div className="text-[0.85rem] font-bold text-gray-900 mt-1">
              Total: ₹{price * item.quantity}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className="w-7 h-7 bg-white rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 border-none shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(item, -1);
              }}
            >
              <Minus size={14} />
            </button>
            <span className="px-3 font-semibold min-w-[30px] text-center">{item.quantity}</span>
            <button
              className="w-7 h-7 bg-white rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 border-none shadow-sm"
              onClick={() => updateQuantity(item, 1)}
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(item);
            }}
          >
            <Trash2 size={18} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
