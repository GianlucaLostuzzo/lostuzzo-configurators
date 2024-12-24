import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import { BiBattery, BiCar, BiHome, BiPackage } from "react-icons/bi";
import { BsSnow, BsUmbrella } from "react-icons/bs";
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
            { label: "Home", href: "/", icon: <BiHome /> },
            { label: "Batterie", href: "/batteries", icon: <BiBattery /> },
            { label: "Catene da neve", href: "/snow-chains", icon: <BsSnow /> },
            { label: "Bauli per aiuto", href: "/car-trunks", icon: <BiCar /> },
            {
              label: "Teli copriauto",
              href: "/car-covers",
              icon: <BsUmbrella />,
            },
            {
              label: "Oli lubrificanti",
              href: "/lubricating-oils",
              icon: <RiOilFill />,
            },
            {
              label: "Portaggio e carico",
              href: "/roof-bars",
              icon: <BiPackage />,
            },
          ]}
        >
          <FadeIn>{children}</FadeIn>
        </Menu>
      </body>
    </html>
  );
}
