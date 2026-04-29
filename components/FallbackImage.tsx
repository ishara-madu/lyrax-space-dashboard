"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function FallbackImage({ src, fallbackSrc, alt, fill, className, sizes, priority }: FallbackImageProps) {
  const [imgError, setImgError] = useState(false);
  const currentSrc = imgError ? fallbackSrc : src;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setImgError(true)}
    />
  );
}
