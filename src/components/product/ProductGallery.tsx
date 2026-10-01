"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

/** Product image gallery with a large view and clickable thumbnails. */
export function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal">
        <Image
          src={current}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {badge ? (
          <div className="absolute top-4 left-4 z-10">
            <Badge tone="light">{badge}</Badge>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-[4/5] overflow-hidden border transition-colors",
                index === active ? "border-black" : "border-transparent hover:border-black/30",
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
