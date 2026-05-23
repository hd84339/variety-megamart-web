import { Star } from "lucide-react";

const StarRating = ({ rating = 0, maxStars = 5, size = 18 }) => {
  const normalizedRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const isActive = normalizedRating >= index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={isActive ? "text-yellow-400" : "text-gray-300"}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
