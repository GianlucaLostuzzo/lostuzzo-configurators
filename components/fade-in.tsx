"use client";

import { usePathname } from "next/navigation";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="animate-fade-in" key={pathname}>
      {children}
    </div>
  );
}
