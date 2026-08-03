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
    <section className="mx-auto max-w-6xl">
      {!image ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-[1.75rem] border border-dashed p-10 text-center transition md:p-12 ${
            isDragActive
              ? "border-blue-400 bg-blue-500/10"
              : "border-white/10 bg-slate-950/70 hover:border-blue-400/30 hover:bg-slate-900/90"
          }`}
        >
          <input {...getInputProps()} />

          <FaCloudUploadAlt
            className="mx-auto mb-5 text-blue-400"
            size={56}
          />

          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Upload Schlieren Image
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Drag & Drop or Click to Upload
          </p>

          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            PNG • JPG • JPEG • BMP • TIFF
          </p>
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 md:h-100 lg:flex-[1.4]">
              <Image
                src={image.preview}
                alt="Uploaded"
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="lg:w-72">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-blue-200">Selected file</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>
                    <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Name</span>
                    <span className="mt-1 block break-all text-white">{image.name}</span>
                  </p>

                  <p>
                    <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Type</span>
                    <span className="mt-1 block text-white">{image.type}</span>
                  </p>

                  <p>
                    <span className="block text-xs uppercase tracking-[0.25em] text-slate-500">Size</span>
                    <span className="mt-1 block text-white">{(image.size / 1024 / 1024).toFixed(2)} MB</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  onImageSelected?.(null);
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
              >
                <FaTrash />
                Remove Image
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}