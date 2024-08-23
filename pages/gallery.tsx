"use client";
import React, { useState, useEffect } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

const photos = [
  {
    src: "/Million Candles/BCS Pink/1.png",
    title: "Photo 1",
  },
  {
    src: "/Million Candles/BCS Pink/2.png",
    title: "Photo 2",
  },
  {
    src: "/Million Candles/BCS Pink/3.png",
    title: "Photo 4",
  },
  {
    src: "/Million Candles/BCS Pink/4.png",
    title: "Photo 5",
  },
];

const preloadImage = (src: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve({ src, width: img.width, height: img.height });
    };
  });
};

const PhotoGallery = () => {
  const [loadedPhotos, setLoadedPhotos] = useState<any>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const loaded = await Promise.all(
        photos.map((photo) => preloadImage(photo.src))
      );
      setLoadedPhotos(
        loaded.map((photo: any, index) => ({
          ...photo,
          title: photos[index].title,
        }))
      );
    };

    loadPhotos();
  }, []);

  return (
    <main className="dark:bg-gray-900">
      <div className="container mx-auto py-12">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Spoonie Seneng
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Spoonie Seneng adalah Kegiatan Rutin Mingguan sebagai Penghibur
            Pasien.
          </p>
        </div>
        <Gallery>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadedPhotos.map((photo: any, index: number) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                <Item
                  original={photo.src}
                  thumbnail={photo.src}
                  width={photo.width}
                  height={photo.height}
                >
                  {({ ref, open }) => (
                    <img
                      ref={ref}
                      onClick={open}
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  )}
                </Item>
              </div>
            ))}
          </div>
        </Gallery>
      </div>
    </main>
  );
};

export default PhotoGallery;
