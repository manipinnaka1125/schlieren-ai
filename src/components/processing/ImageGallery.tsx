import Image from "next/image";

interface Props {
  images: {
    title: string;
    src: string;
  }[];
}

export default function ImageGallery({ images }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.title}
            className="rounded-2xl bg-slate-900 p-4"
          >
            <h3 className="mb-4 text-center font-bold">
              {image.title}
            </h3>

            <div className="relative h-64 overflow-hidden rounded-xl bg-slate-950">
              <Image
                src={image.src}
                alt={image.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}