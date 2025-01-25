"use client";
import Image from "next/image";
import { useState } from "react";

export interface ImageWithFallbackProps {
  href: string;
}

export default function ImageWithFallback(props: ImageWithFallbackProps) {
  const [url, setUrl] = useState(props.href.toLowerCase());

  const hasNotImage = url !== props.href;

  return (
    <div
      className={hasNotImage ? "flex justify-center items-center w-full" : ""}
    >
      <Image
        src={url}
        layout={!hasNotImage ? "fill" : undefined}
        alt=""
        width={hasNotImage ? 50 : undefined}
        height={hasNotImage ? 50 : undefined}
        onError={() => setUrl("/fallback-product-img.png")}
      />
    </div>
  );
}
