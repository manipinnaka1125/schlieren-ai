"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { UploadedImage } from "../../../types/image";

interface Props {
  onImageSelected?: (image: UploadedImage | null) => void;
}

export default function ImageUploader({ onImageSelected }: Props) {
  const [image, setImage] = useState<UploadedImage | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    const nextImage: UploadedImage = {
      file,
      preview,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    setImage(nextImage);
    onImageSelected?.(nextImage);
  }, [onImageSelected]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/bmp": [],
      "image/tiff": [],
    },
    multiple: false,
  });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {!image ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 bg-slate-900"
          }`}
        >
          <input {...getInputProps()} />

          <FaCloudUploadAlt
            className="mx-auto mb-6 text-blue-500"
            size={70}
          />

          <h2 className="text-3xl font-bold">
            Upload Schlieren Image
          </h2>

          <p className="mt-4 text-slate-400">
            Drag & Drop or Click to Upload
          </p>

          <p className="mt-2 text-sm text-slate-500">
            PNG • JPG • JPEG • BMP • TIFF
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 p-8">
          <div className="relative mx-auto h-125 w-full max-w-4xl overflow-hidden rounded-xl bg-slate-950">
            <Image
              src={image.preview}
              alt="Uploaded"
              fill
              unoptimized
              className="object-contain"
            />
          </div>

          <div className="mt-8 space-y-2">
            <p>
              <strong>Name:</strong> {image.name}
            </p>

            <p>
              <strong>Type:</strong> {image.type}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {(image.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            onClick={() => {
              setImage(null);
              onImageSelected?.(null);
            }}
            className="mt-8 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 hover:bg-red-700"
          >
            <FaTrash />
            Remove Image
          </button>
        </div>
      )}
    </section>
  );
}