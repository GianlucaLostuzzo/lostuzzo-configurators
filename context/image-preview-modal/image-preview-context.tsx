"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import Image from "next/image";

// Define the context types
interface ImagePreviewContextProps {
  openModal: (imageUrl: string) => void;
  closeModal: () => void;
}

// Create the context
export const ImagePreviewContext = createContext<
  ImagePreviewContextProps | undefined
>(undefined);

interface ImagePreviewProviderProps {
  children: ReactNode;
}

// Global Modal Provider
export const ImagePreviewContextProvider = ({
  children,
}: ImagePreviewProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // State to track if running on the client

  const openModal = (imageUrl: string) => {
    setImageUrl(imageUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setImageUrl(null);
    setIsOpen(false);
  };

  // Check if running on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Modal JSX
  const modal = isOpen ? (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:px-10 sm:py-10 w-full"
      onClick={closeModal}
    >
      <div
        className="mx-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Preview"
            width={600}
            height={400}
            className="rounded-lg object-contain"
          />
        )}
      </div>
    </div>
  ) : null;

  return (
    <ImagePreviewContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal}
    </ImagePreviewContext.Provider>
  );
};
