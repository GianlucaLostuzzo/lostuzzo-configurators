"use client";
import { useImagePreview } from "@/hooks/use-image-preview";
import Image from "next/image";
import { useState } from "react";

export interface ImageWithFallbackProps {
  href: string | null;
  brand?: string;
}

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;
const fallback = "/fallback-product-img.png";
const getPlaceholder = (brand: string) =>
  `${STATIC_URL}/placeholders/${encodeURIComponent(brand.toLowerCase())}.jpg`;

export default function ImageWithFallback(props: ImageWithFallbackProps) {
  // Start with the primary image URL (lowercase for consistency)
  const [url, setUrl] = useState(props.href?.toLowerCase() ?? "");
  const preview = useImagePreview();

  // Determine if we're displaying the fallback image
  const hasNotImage = url === fallback;

  // onError handler to try the placeholder (if brand exists) and then fallback
  const handleError = () => {
    if (props.brand && url !== getPlaceholder(props.brand)) {
      // First fallback: try the placeholder image if not already attempted
      setUrl(getPlaceholder(props.brand));
    } else if (url !== fallback) {
      // Second fallback: if the placeholder fails or no brand is provided, use the fallback
      setUrl(fallback);
    }
  };

  return (
    <div
      className={
        hasNotImage
          ? "flex justify-center items-center w-full max-h-40"
          : "flex max-h-40"
      }
      onClick={() => url !== fallback && preview.openModal(url)}
    >
      <Image
        src={url}
        alt=""
        onError={handleError}
        width={url === fallback ? 150 : 400}
        height={url === fallback ? 150 : 300}
        unoptimized={url !== fallback ? true : undefined}
        className="object-contain"
      />
    </div>
  );
}
