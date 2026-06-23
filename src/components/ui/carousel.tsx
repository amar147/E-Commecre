"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CarouselApi = NonNullable<UseEmblaCarouselType[1]>;
type CarouselProps = {
  opts?: EmblaOptionsType;
  setApi?: (api: CarouselApi) => void;
  draggable?: boolean;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi | undefined;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  opts,
  setApi,
  draggable = true,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "className"> &
  CarouselProps & { className?: string }) {
  const mergedOpts = React.useMemo(
    () => ({
      ...opts,
      watchDrag: draggable,
    }),
    [draggable, opts],
  );

  const [carouselRef, api] = useEmblaCarousel(mergedOpts);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((emblaApi: CarouselApi) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        data-slot="carousel"
        className={cn("relative", className)}
        {...props}
      />
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden [touch-action:pan-y]"
      data-slot="carousel-content"
    >
      <div className={cn("flex", className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      size="icon"
      variant="secondary"
      className={cn(
        "absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 text-[#16A34A] shadow-sm hover:bg-white active:-translate-y-1/2!",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      size="icon"
      variant="secondary"
      className={cn(
        "absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 text-[#16A34A] shadow-sm hover:bg-white active:-translate-y-1/2!",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

function CarouselIndicators({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const onChange = () => {
      setScrollSnaps(api.scrollSnapList());
      setSelectedIndex(api.selectedScrollSnap());
    };

    onChange();
    api.on("reInit", onChange);
    api.on("select", onChange);

    return () => {
      api.off("select", onChange);
      api.off("reInit", onChange);
    };
  }, [api]);

  if (scrollSnaps.length <= 1) {
    return null;
  }

  return (
    <div
      data-slot="carousel-indicators"
      className={cn(
        "pointer-events-auto absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full  px-3 py-1.5 ",
        className,
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={`carousel-dot-${index}`}
          type="button"
          onClick={() => api?.scrollTo(index)}
          className={cn(
            "h-3 rounded-full transition-all",
            selectedIndex === index
              ? "w-8 bg-[#BBF7D0] ring-1 ring-white"
              : "w-3 bg-white/60 hover:bg-white/80",
          )}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={selectedIndex === index}
        />
      ))}
    </div>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
};
