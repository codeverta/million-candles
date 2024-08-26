"use client";
import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Layout from "components/layout/Landing";
import { getFiles } from "utils/getFiles";
import path from "path";

// Utility function to check if the file is an image
const isImageFile = (filePath: any) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return imageExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));
};

// Utility function to check if the file is a video
const isVideoFile = (filePath: any) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));
};

const PhotoGallery = ({ files }: any) => {
  return (
    <main className="dark:bg-gray-900">
      <div className="container mx-auto py-12">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Gallery
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Kumpulan Foto dan Video Produk Kami
          </p>
        </div>
        <Gallery>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files
              .filter(
                (file: any) => isImageFile(file.path) || isVideoFile(file.path)
              )
              .map((file: any, index: number) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-lg"
                >
                  {isImageFile(file.path) && (
                    <Item
                      original={file.path}
                      thumbnail={file.path}
                      width={600}
                      height={600}
                    >
                      {({ ref, open }) => (
                        <img
                          ref={ref}
                          onClick={open}
                          src={file.path}
                          alt={file.name}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      )}
                    </Item>
                  )}
                  {isVideoFile(file.path) && (
                    <video
                      controls
                      className="w-full h-full object-cover cursor-pointer"
                    >
                      <source src={file.path} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ))}
          </div>
        </Gallery>
      </div>
    </main>
  );
};

PhotoGallery.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default PhotoGallery;

export async function getStaticProps() {
  const files = getFiles(path.join(process.cwd(), "public/Million Candles"));
  return {
    props: {
      files,
    },
  };
}
