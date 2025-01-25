"use client";
import { useImagePreview } from "@/hooks/use-image-preview";
import Image from "next/image";
import { useState } from "react";

export interface ImageWithFallbackProps {
  href: string;
}

const fallback = "/fallback-product-img.png";

export default function ImageWithFallback(props: ImageWithFallbackProps) {
  const [url, setUrl] = useState(props.href.toLowerCase());
  const preview = useImagePreview();

  const hasNotImage = url !== props.href;

  return (
    <div
      className={
        hasNotImage
          ? "flex justify-center items-center w-full max-h-30"
          : "flex max-h-30"
      }
      onClick={() => url !== fallback && preview.openModal(url)}
    >
      {hasNotImage ? (
        <Image src={url} alt="" width={50} height={50} />
      ) : (
        <Image
          src={url}
          alt=""
          onError={() => setUrl(fallback)}
          width={400}
          height={300}
          className="object-contain"
        />
      )}
    </div>
  );
}
