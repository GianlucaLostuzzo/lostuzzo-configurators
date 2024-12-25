import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import FadeIn from "@/components/FadeIn";
import NotistackProvider from "@/components/NotistackProvider";
import { menuEntries } from "@/data/menu";

export const metadata: Metadata = {
  title: "Configuratori Lostuzzo",
  description:
    "Configuratori per batterie, catene da neve, oli lubrificanti e altro",
  openGraph: {
    title: "Configuratori Lostuzzo",
    description:
      "Configuratori per batterie, catene da neve, oli lubrificanti e altro",
    images: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Menu entries={menuEntries}>
          <FadeIn>{children}</FadeIn>
        </Menu>
        <NotistackProvider />
      </body>
    </html>
  );
}
