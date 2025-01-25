import { ImagePreviewContext } from "@/context/image-preview-modal/image-preview-context";
import { useContext } from "react";

export const useImagePreview = () => {
  const context = useContext(ImagePreviewContext);
  if (!context) {
    throw new Error("useModal must be used within a GlobalModalProvider");
  }
  return context;
};
