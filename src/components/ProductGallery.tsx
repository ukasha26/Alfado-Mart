import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ProductGalleryProps {
  images: string[];
  altBase: string;
  onImageClick?: () => void;
  className?: string;
}

export function ProductGallery({ images, altBase, onImageClick, className }: ProductGalleryProps) {
  return (
    <Carousel opts={{ loop: true }} className={className}>
      <CarouselContent className="m-0">
        {images.map((imagePath, index) => (
          <CarouselItem key={imagePath} className="basis-full pl-0">
            <button
              type="button"
              onClick={onImageClick}
              className="w-full overflow-hidden border border-[#F3F4F6] bg-white flex items-center justify-center"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={imagePath}
                alt={`${altBase} view ${index + 1}`}
                width={800}
                height={600}
                className="h-full w-full object-contain p-3"
                loading="lazy"
                decoding="async"
              />
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:inline-flex left-4 bg-white text-black shadow-md shadow-black/10 hover:bg-[#F3F4F6]" />
      <CarouselNext className="hidden md:inline-flex right-4 bg-white text-black shadow-md shadow-black/10 hover:bg-[#F3F4F6]" />
    </Carousel>
  );
}
