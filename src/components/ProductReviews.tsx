import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, MessageSquare, PencilLine, Star, UserRound } from "lucide-react";

interface Review {
  id: string;
  name: string;
  createdAt: number;
  rating: number;
  text: string;
  verifiedPurchase: boolean;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Usama",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    rating: 4,
    text: "Bohat zabardast quality hai, totally worth the price!",
    verifiedPurchase: true,
  },
  {
    id: "2",
    name: "Ayesha Khan",
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    rating: 4,
    text: "Delivery time par thi aur product exactly as shown in the picture.",
    verifiedPurchase: true,
  },
  {
    id: "3",
    name: "Bilal",
    createdAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    rating: 4,
    text: "Highly recommended, packaging bohat achi thi.",
    verifiedPurchase: true,
  },
  {
    id: "4",
    name: "Zara",
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "This product is highly recommended zarur try kren quality bohat achi hai and delivery time par thi thank you for the great service and product quality.",
    verifiedPurchase: true,
  },
  {
    id: "5",
    name: "Hamza Ali",
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    rating: 5,
    text: "Fast delivery across Karachi. Quality is genuine and customer support was helpful.",
    verifiedPurchase: true,
  },
];

interface ReviewFormState {
  name: string;
  rating: number;
  text: string;
}

function formatRelativeTime(createdAt: number) {
  const diff = Date.now() - createdAt;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;

  const months = Math.floor(days / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}

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
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState<ReviewFormState>({
    name: "",
    rating: 5,
    text: "",
  });

  const averageRating = useMemo(
    () => (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    [reviews]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim() || !formState.text.trim()) {
      return;
    }

    setReviews((current) => [
      {
        id: `review-${Date.now()}`,
        name: formState.name.trim(),
        createdAt: Date.now(),
        rating: formState.rating,
        text: formState.text.trim(),
        verifiedPurchase: true,
      },
      ...current,
    ]);

    setFormState({ name: "", rating: 5, text: "" });
    setIsFormOpen(false);
  };

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
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-[#F3F4F6] bg-white px-4 py-2">
              <StarRating rating={Math.round(Number(averageRating))} />
              <span className="text-sm font-semibold text-black">{averageRating}</span>
              <span className="text-xs text-[#666]">({reviews.length} reviews)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
            >
              <PencilLine size={16} />
              Write a Review
            </button>
          </div>
        </div>

        {isFormOpen ? (
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-sm md:p-5"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                  Name
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2.5 focus-within:border-black">
                  <UserRound size={16} className="text-[#666]" />
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Your name"
                    className="w-full border-0 bg-transparent text-sm text-black outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                  Star Rating
                </span>
                <div className="grid grid-cols-5 gap-2 rounded-xl border border-[#E5E7EB] p-2.5">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    const isActive = value <= formState.rating;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormState((current) => ({ ...current, rating: value }))}
                        className={`flex h-9 items-center justify-center rounded-lg transition-colors ${
                          isActive ? "bg-[#F2A93B] text-black" : "bg-[#FAFAFA] text-[#9CA3AF] hover:bg-[#F3F4F6]"
                        }`}
                        aria-label={`${value} star rating`}
                      >
                        <Star size={14} className={isActive ? "fill-current" : ""} />
                      </button>
                    );
                  })}
                </div>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#2A2A2A]">
                Comment
              </span>
              <div className="rounded-xl border border-[#E5E7EB] px-3 py-3 focus-within:border-black">
                <div className="flex items-start gap-2">
                  <MessageSquare size={16} className="mt-0.5 text-[#666]" />
                  <textarea
                    rows={4}
                    value={formState.text}
                    onChange={(event) => setFormState((current) => ({ ...current, text: event.target.value }))}
                    placeholder="Share your experience"
                    className="w-full resize-none border-0 bg-transparent text-sm text-black outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id}>
              <article className="h-full rounded-2xl border border-[#F3F4F6] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-black">{review.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#666]">
                      <CalendarDays size={12} />
                      <time dateTime={new Date(review.createdAt).toISOString()}>
                        {formatRelativeTime(review.createdAt)}
                      </time>
                    </div>
                  </div>
                  {review.verifiedPurchase ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                      <BadgeCheck size={12} />
                      Verified Purchase
                    </span>
                  ) : null}
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