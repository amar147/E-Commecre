"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const sliderItems = [
  {
    image: "/assets/images/slidebar_1.jpg",
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
  },
  {
    image: "/assets/images/slidebar_2.jpg",
    title: "Seasonal Picks for Your Kitchen",
    subtitle: "Handpicked weekly deals for your family",
  },
  {
    image: "/assets/images/slidebar_3.jpg",
    title: "Everyday Essentials, Better Prices",
    subtitle: "Save more with fresh quality groceries",
  },
];

export default function MainHeroCarousel() {
  return (
    <section className="w-full">
      <Carousel
        opts={{ loop: true, watchDrag: true }}
        draggable
        className="overflow-hidden"
      >
        <CarouselContent>
          {sliderItems.map((slide) => (
            <CarouselItem key={slide.image}>
              <div className="relative h-77.5 w-full overflow-hidden rounded-none md:h-107.5">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#16A34A]/70" />

                <div className="pointer-events-none absolute inset-0 z-10 flex items-center pb-12">
                  <div className="w-full px-6 text-white md:px-10 lg:px-20 xl:px-24">
                    <div className="pointer-events-auto max-w-md">
                      <h1 className="text-type-max font-bold">{slide.title}</h1>
                      <p className="mt-3 text-type-md-lg text-white/95">
                        {slide.subtitle}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                        <Button
                          className="text-type-base h-11 rounded-xl px-6 font-semibold"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#16A34A",
                          }}
                        >
                          Shop Now
                        </Button>
                        <Button
                          variant="outline"
                          className="text-type-base h-11 rounded-xl border-white/75 bg-transparent px-6 text-white hover:bg-white/10"
                        >
                          View Deals
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 hidden h-11 w-11 cursor-pointer border-0 md:flex lg:left-4 lg:h-10 lg:w-10 lg:bg-white/60 lg:opacity-80 lg:hover:bg-white/90 lg:hover:opacity-100 xl:left-6" />
        <CarouselNext className="right-3 hidden h-11 w-11 cursor-pointer border-0 md:flex lg:right-4 lg:h-10 lg:w-10 lg:bg-white/60 lg:opacity-80 lg:hover:bg-white/90 lg:hover:opacity-100 xl:right-6" />
        <CarouselIndicators className="bottom-6 md:bottom-6" />
      </Carousel>
    </section>
  );
}
