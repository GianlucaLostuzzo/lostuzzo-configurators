import type { Metadata } from "next";
import "./globals.css";
import FadeIn from "@/components/fade-in";
import NotistackProvider from "@/components/notistack-provider";
import { menuEntries } from "@/data/menu";
import { ImagePreviewContextProvider } from "@/context/image-preview-modal/image-preview-context";
import Menu from "@/components/MainMenu";

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
        <ImagePreviewContextProvider>
          <Menu entries={menuEntries}>
            <FadeIn>{children}</FadeIn>
          </Menu>
        </ImagePreviewContextProvider>
        <NotistackProvider />
      </body>
    </html>
  );
}
