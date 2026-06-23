"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageGalleryProps {
  imageCover: string;
  images: string[];
  productName: string;
}

export default function ImageGallery({
  imageCover,
  images,
  productName,
}: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(imageCover);
  const [isMainImageLoading, setIsMainImageLoading] = useState(true);
  const [loadedThumbs, setLoadedThumbs] = useState<Record<string, boolean>>({});
  const galleryImages = [imageCover, ...(images || [])];

  const scrollThumbnails = (direction: "left" | "right") => {
    const container = document.getElementById("thumbnails-scroll");
    if (container) {
      const scrollAmount = 100;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {isMainImageLoading ? (
          <Skeleton className="absolute inset-0 rounded-lg" />
        ) : null}
        <Image
          src={mainImage}
          alt={productName}
          fill
          onLoad={() => setIsMainImageLoading(false)}
          className={`object-cover transition-opacity duration-300 ${
            isMainImageLoading ? "opacity-0" : "opacity-100"
          }`}
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="relative">
        <div
          id="thumbnails-scroll"
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {galleryImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMainImage(image);
                setIsMainImageLoading(true);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                mainImage === image
                  ? "border-green-600"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              {!loadedThumbs[image] ? (
                <Skeleton className="absolute inset-0 rounded-lg" />
              ) : null}
              <Image
                src={image}
                alt={`${productName}-${idx}`}
                width={64}
                height={64}
                onLoadingComplete={() =>
                  setLoadedThumbs((prev) => ({ ...prev, [image]: true }))
                }
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  loadedThumbs[image] ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Scroll Buttons */}
        {galleryImages.length > 4 && (
          <>
            <button
              onClick={() => scrollThumbnails("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollThumbnails("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
