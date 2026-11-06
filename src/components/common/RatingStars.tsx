import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 14,
}) => {
  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className="font-semibold text-slate-700 ml-0.5">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-slate-400 font-normal">({reviewCount})</span>
      )}
    </div>
  );
};
