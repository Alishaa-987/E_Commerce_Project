import React from "react";
import { AiFillStar } from "react-icons/ai";
import { FiTrendingUp } from "react-icons/fi";

const SellerProfileReviewsTab = ({ shopReviews, averageRating }) => {
  const hasReviews = shopReviews.length > 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Average Rating</p>
          <p className="mt-4 text-3xl font-semibold text-white">{averageRating}</p>
          <p className="mt-2 text-sm text-white/45">Across recent shop reviews</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Total Reviews</p>
          <p className="mt-4 text-3xl font-semibold text-white">{shopReviews.length}</p>
          <p className="mt-2 text-sm text-white/45">Visible feedback this cycle</p>
        </div>
        <div className="rounded-[26px] border border-white/10 bg-[#111114] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">Review Trend</p>
          <p className="mt-4 flex items-center gap-2 text-3xl font-semibold text-white">
            <FiTrendingUp size={22} className="text-emerald-300" />
            Strong
          </p>
          <p className="mt-2 text-sm text-white/45">Positive feedback is holding steady</p>
        </div>
      </div>

      {hasReviews ? (
        <div className="space-y-4">
          {shopReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{review.name}</p>
                  <p className="mt-1 text-sm text-white/40">{review.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <AiFillStar
                      key={`${review.id}-${index}`}
                      size={15}
                      className={
                        index < review.rating ? "text-emerald-300" : "text-white/20"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-lg font-medium text-white">{review.title}</p>
              <p className="mt-3 text-sm leading-7 text-white/55">{review.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
          <h3 className="text-2xl font-Playfair font-semibold text-white">
            No reviews yet
          </h3>
          <p className="mt-3 text-sm text-white/50">
            Real seller reviews are not available yet, so this section will stay empty until that backend flow is added.
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerProfileReviewsTab;
