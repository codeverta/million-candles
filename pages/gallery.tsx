"use client";
import React from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Layout from "components/layout/Landing";
import api from "utils/api";
import { useQuery } from "@tanstack/react-query";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Utility function to check if the file is an image
const isImageFile = (filePath: any) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return imageExtensions.some((ext) => filePath.toLowerCase().includes(ext));
};

// Utility function to check if the file is a video
const isVideoFile = (filePath: any) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => filePath.toLowerCase().includes(ext));
};

const PhotoGallery = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      return api.get("documents");
    },
  });

  if (query.isError) {
    return <div>Terjadi error</div>;
  }

  if (query.isLoading) {
    return <LoadingBackdrop />;
  }

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
            {query.data.data.data
              .filter(
                (file: any) =>
                  isImageFile(file.attributes.filename) ||
                  isVideoFile(file.attributes.filename)
              )
              .map((file: any, index: number) => {
                const filepath = file.attributes.filename;
                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    {isImageFile(filepath) && (
                      <Item
                        original={filepath}
                        thumbnail={filepath}
                        width={600}
                        height={600}
                      >
                        {({ ref, open }) => (
                          <img
                            ref={ref}
                            onClick={open}
                            src={filepath}
                            alt={file.name}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        )}
                      </Item>
                    )}
                    {isVideoFile(filepath) && (
                      <video
                        controls
                        className="w-full h-full object-cover cursor-pointer"
                      >
                        <source src={filepath} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                );
              })}
          </div>
        </Gallery>
      </div>
    </main>
  );
};

PhotoGallery.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "order"])),
    },
  };
}

export default PhotoGallery;
