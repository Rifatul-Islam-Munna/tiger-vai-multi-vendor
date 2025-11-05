
import React, { useCallback, useState } from "react";
import { X, Upload } from "lucide-react";

interface ImageUploadFieldProps {
  onImagesSelected: (
    images: Array<{ url: string; key: string; id: string }>
  ) => void;
  maxFiles?: number;
  label?: string;
  isThumbnail?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onImagesSelected,
  maxFiles = 5,
  label = "Upload Images",
  isThumbnail = false,
}) => {
  const [preview, setPreview] = useState<
    Array<{ file: File; preview: string; data?: { url: string; key: string; id: string } }>
  >([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files: FileList) => {
      if (isThumbnail && preview.length > 0) {
        // Remove previous thumbnail
        setPreview([]);
      }

      const newFiles = Array.from(files).slice(
        0,
        maxFiles - (isThumbnail ? 0 : preview.length)
      );

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview((prev) => [
            ...prev,
            {
              file,
              preview: e.target?.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    [preview.length, maxFiles, isThumbnail]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllAndNotify = () => {
    const imagesToNotify = preview
      .filter((p) => p.data)
      .map((p) => p.data!) as Array<{ url: string; key: string; id: string }>;

    onImagesSelected(imagesToNotify);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--palette-text)" }}>
        {label}
      </label>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-[var(--palette-btn)] bg-[var(--palette-btn)]/10"
            : "border-[var(--palette-accent-3)]"
        }`}
        style={{
          backgroundColor: dragActive ? "rgba(255, 107, 122, 0.1)" : "transparent",
        }}
      >
        <input
          type="file"
          multiple={!isThumbnail}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
          id={isThumbnail ? "thumbnail-upload" : "images-upload"}
        />

        <label
          htmlFor={isThumbnail ? "thumbnail-upload" : "images-upload"}
          className="cursor-pointer"
        >
          <Upload className="mx-auto h-12 w-12 mb-2" style={{ color: "var(--palette-btn)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--palette-text)" }}>
            Drag and drop {isThumbnail ? "image" : "images"} here, or click to select
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--palette-accent-3)" }}
          >
            {isThumbnail ? "1" : `Up to ${maxFiles}`} image{!isThumbnail ? "s" : ""} supported
          </p>
        </label>
      </div>

      {/* Preview Grid */}
      {preview.length > 0 && (
        <div className={`mt-4 grid gap-4 ${isThumbnail ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
          {preview.map((item, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--palette-bg)" }}
            >
              <img
                src={item.preview}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
