import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel, { type EmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryItem =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string; poster?: string };

interface ProductGalleryProps {
  images?: string[];
  mediaItems?: GalleryItem[];
  altBase: string;
  onImageClick?: () => void;
  className?: string;
}

function getUniqueMedia(mediaItems: GalleryItem[]) {
  return Array.from(new Map(mediaItems.filter(Boolean).map((item) => [`${item.type}:${item.src}`, item])).values());
}

export function ProductGallery({ images = [], mediaItems, altBase, onImageClick, className }: ProductGalleryProps) {
  const galleryMedia = useMemo(() => {
    if (mediaItems?.length) {
      return getUniqueMedia(mediaItems);
    }

    return getUniqueMedia(images.filter(Boolean).map((src) => ({ type: "image" as const, src })));
  }, [images, mediaItems]);
  const emblaOptions = useMemo(
    () => ({
      loop: galleryMedia.length > 1,
      align: "start" as const,
      containScroll: "trimSnaps" as const,
    }),
    [galleryMedia.length]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainViewportRef, mainEmblaApi] = useEmblaCarousel(emblaOptions);

  const mediaSignature = useMemo(
    () => galleryMedia.map((item) => `${item.type}:${item.src}`).join("|"),
    [galleryMedia]
  );

  useEffect(() => {
    if (!mainEmblaApi) {
      return;
    }

    setSelectedIndex(0);
    mainEmblaApi?.scrollTo(0, true);
  }, [mainEmblaApi, mediaSignature]);

  useEffect(() => {
    if (!mainEmblaApi) {
      return;
    }

    const updateSelectedIndex = (emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    updateSelectedIndex(mainEmblaApi);
    mainEmblaApi.on("select", updateSelectedIndex);
    mainEmblaApi.on("reInit", updateSelectedIndex);

    return () => {
      mainEmblaApi.off("select", updateSelectedIndex);
      mainEmblaApi.off("reInit", updateSelectedIndex);
    };
  }, [mainEmblaApi]);

  const scrollPrev = () => mainEmblaApi?.scrollPrev();
  const scrollNext = () => mainEmblaApi?.scrollNext();
  const scrollTo = (index: number) => mainEmblaApi?.scrollTo(index);

  if (galleryMedia.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-[#F3F4F6] bg-white">
        <div className="overflow-hidden" ref={mainViewportRef}>
          <div className="flex touch-pan-y">
            {galleryMedia.map((mediaItem, index) => (
              <div key={`${mediaItem.type}-${mediaItem.src}-${index}`} className="min-w-0 flex-[0_0_100%]">
                <div
                  onClick={onImageClick}
                  className="group relative flex w-full items-center justify-center bg-white"
                  aria-label={`${altBase} ${mediaItem.type} ${index + 1}`}
                  role={onImageClick ? "button" : undefined}
                  tabIndex={onImageClick ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (!onImageClick) {
                      return;
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onImageClick();
                    }
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-black/[0.02] via-transparent to-black/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {mediaItem.type === "video" ? (
                    <video
                      src={mediaItem.src}
                      poster={mediaItem.poster}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-square h-full w-full object-contain p-3 sm:aspect-[4/3] sm:p-5"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={mediaItem.src}
                      alt={mediaItem.alt ?? `${altBase} view ${index + 1}`}
                      width={1200}
                      height={1200}
                      className="aspect-square h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.01] sm:aspect-[4/3] sm:p-5"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {galleryMedia.length > 1 ? (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full border border-black/5 bg-white/95 text-black shadow-lg shadow-black/10 backdrop-blur transition-transform hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              aria-label="Previous product image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 inline-flex size-10 items-center justify-center rounded-full border border-black/5 bg-white/95 text-black shadow-lg shadow-black/10 backdrop-blur transition-transform hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              aria-label="Next product image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}
      </div>

      {galleryMedia.length > 1 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2" aria-label="Image pagination">
            {galleryMedia.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to image ${index + 1}`}
                aria-current={selectedIndex === index}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-200",
                  selectedIndex === index ? "w-6 bg-black" : "w-2.5 bg-black/20 hover:bg-black/35"
                )}
              />
            ))}
          </div>

          <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2">
              {galleryMedia.map((mediaItem, index) => (
                <button
                  key={`thumb-${mediaItem.type}-${mediaItem.src}-${index}`}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "relative flex h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-200 sm:h-24 sm:w-24",
                    selectedIndex === index
                      ? "border-black ring-2 ring-black/10"
                      : "border-[#E5E7EB] hover:border-black/40"
                  )}
                  aria-label={`Select image ${index + 1}`}
                  aria-pressed={selectedIndex === index}
                >
                  {mediaItem.type === "video" ? (
                    <div className="flex h-full w-full items-center justify-center bg-black/5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                      Video
                    </div>
                  ) : (
                    <img
                      src={mediaItem.src}
                      alt={`${altBase} thumbnail ${index + 1}`}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover p-1.5"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
