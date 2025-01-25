"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={closeModal}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Preview"
            width={1920}
            height={1080}
            className="rounded-lg object-contain max-w-[90vw] max-h-[90vh]"
          />
        )}
      </div>
    </div>
  ) : (
    <></>
  );

  return (
    <ImagePreviewContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isClient && ReactDOM.createPortal(modal, document.body)}
    </ImagePreviewContext.Provider>
  );
};
