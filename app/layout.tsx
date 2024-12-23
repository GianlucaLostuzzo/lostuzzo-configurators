import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import { BiBattery } from "react-icons/bi";
import { BsSnow } from "react-icons/bs";
import { RiOilFill } from "react-icons/ri";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Configuratori Lostuzzo",
  description:
    "Configuratori per batterie, catene da neve, oli lubrificanti e altro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Menu
          entries={[
            { label: "Batterie", href: "/batteries", icon: <BiBattery /> },
            { label: "Catene da neve", href: "/snow-chains", icon: <BsSnow /> },
            {
              label: "Oli lubrificanti",
              href: "/lubricating-oils",
              icon: <RiOilFill />,
            },
          ]}
        />
        <FadeIn>{children}</FadeIn>
      </body>
    </html>
  );
}
