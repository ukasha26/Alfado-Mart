import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Usama",
    date: "March 2026",
    rating: 4,
    text: "Bohat zabardast quality hai, totally worth the price!",
  },
  {
    id: "2",
    name: "Ayesha Khan",
    date: "February 2026",
    rating: 4, // 4 Star kar diya
    text: "Delivery time par thi aur product exactly as shown in the picture.",
  },
  {
    id: "3",
    name: "Bilal",
    date: "February 2026",
    rating: 4, // 4 Star kar diya
    text: "Highly recommended, packaging bohat achi thi.",
  },
  {
    id: "4",
    name: "Zara",
    date: "January 2026",
    rating: 5,
    text: "This product is highly recommended zarur try kren quality bohat achi hai and delivery time par thi thank you for the great service and product quality.",
  },
  {
    id: "5",
    name: "Hamza Ali",
    date: "January 2026",
    rating: 5,
    text: "Fast delivery across Karachi. Quality is genuine and customer support was helpful.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-[#F2A93B] text-[#F2A93B]" : "fill-[#E5E7EB] text-[#E5E7EB]"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

interface ProductReviewsProps {
  productName: string;
}

export function ProductReviews({ productName }: ProductReviewsProps) {
  const averageRating = (
    REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  return (
    <section
      aria-labelledby="reviews-heading"
      className="border-t border-[#F3F4F6] bg-[#FAFAFA] px-4 py-10 md:px-12"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="reviews-heading" className="text-lg font-semibold text-black md:text-xl">
              Customer Reviews
            </h2>
            <p className="mt-1 text-sm text-[#2A2A2A]">
              What buyers say about {productName}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#F3F4F6] bg-white px-4 py-2">
            <StarRating rating={Math.round(Number(averageRating))} />
            <span className="text-sm font-semibold text-black">{averageRating}</span>
            <span className="text-xs text-[#666]">({REVIEWS.length} reviews)</span>
          </div>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <li key={review.id}>
              <article className="h-full rounded-lg border border-[#F3F4F6] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-black">{review.name}</p>
                  <time className="text-xs text-[#666]" dateTime={review.date}>
                    {review.date}
                  </time>
                </div>
                <div className="mt-2">
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#2A2A2A]">{review.text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}