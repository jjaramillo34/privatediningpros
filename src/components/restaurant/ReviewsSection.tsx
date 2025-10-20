'use client';

import { Star, TrendingUp } from 'lucide-react';

interface ReviewsSectionProps {
  rating?: number;
  reviews?: number;
  reviews_per_score?: string;
  reviews_tags?: string;
}

export default function ReviewsSection({ rating, reviews, reviews_per_score, reviews_tags }: ReviewsSectionProps) {
  if (!rating && !reviews) return null;

  let reviewsData: Record<string, number> = {};
  let tags: string[] = [];

  try {
    if (reviews_per_score) {
      reviewsData = JSON.parse(reviews_per_score);
    }
  } catch (e) {
    // Ignore parse errors
  }

  try {
    if (reviews_tags) {
      tags = JSON.parse(reviews_tags);
    }
  } catch (e) {
    // Ignore parse errors
  }

  const totalReviews = Object.values(reviewsData).reduce((sum, count) => sum + count, 0) || reviews || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
      <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Star className="h-8 w-8 text-yellow-500 mr-3 fill-current" />
        Reviews & Ratings
      </h3>

      {/* Overall Rating */}
      <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
        <div>
          <p className="text-6xl font-bold text-gray-900">{rating}</p>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-5 w-5 ${star <= (rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{totalReviews.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </div>
      </div>

      {/* Rating Distribution */}
      {Object.keys(reviewsData).length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewsData[star] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-12">{star} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">{count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Keywords */}
      {tags.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            Popular Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:border-blue-400 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

