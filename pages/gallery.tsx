"use client";
import React, { useState, useEffect, useRef } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Layout from "components/layout/Landing";
import api from "utils/api";
import { useQuery } from "@tanstack/react-query";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("common");
  const [visibleItems, setVisibleItems] = useState<number>(12); // Initial number of visible items
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(
    null
  );

  // Fetch all data once - this is your single API request
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      return api.get("documents");
    },
  });

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.data?.data?.data) {
          // When the observer target is visible, load more items
          const totalItems = query.data.data.data.filter(
            (file: any) =>
              isImageFile(file.attributes.filename) ||
              isVideoFile(file.attributes.filename)
          ).length;

          if (visibleItems < totalItems) {
            // Load more items when scrolling
            setVisibleItems((prev) => Math.min(prev + 12, totalItems));
          }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [observerTarget, query.data, visibleItems]);

  if (query.isError) {
    return <div>Terjadi error</div>;
  }

  if (query.isLoading) {
    return <LoadingBackdrop />;
  }

  // Filter media files
  const mediaFiles = query.data.data.data.filter(
    (file: any) =>
      isImageFile(file.attributes.filename) ||
      isVideoFile(file.attributes.filename)
  );

  // Get only the items we want to display
  const itemsToRender = mediaFiles.slice(0, visibleItems);

  return (
    <main className="dark:bg-gray-900">
      <div className="container mx-auto py-12">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            {t("gallery.title")}
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            {t("gallery.description")}
          </p>
        </div>
        <Gallery>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemsToRender.map((file: any, index: number) => {
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
                          ref={ref as React.RefObject<HTMLImageElement>}
                          onClick={open}
                          src={filepath}
                          alt={file.name || "Gallery image"}
                          className="w-full h-full object-cover cursor-pointer"
                          loading="lazy" // Native lazy loading
                        />
                      )}
                    </Item>
                  )}
                  {isVideoFile(filepath) && (
                    <video
                      controls
                      className="w-full h-full object-cover cursor-pointer"
                      preload="none" // Prevent video preloading
                    >
                      <source src={filepath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              );
            })}
          </div>

          {/* Observer target - when this is visible, load more items */}
          {visibleItems < mediaFiles.length && (
            <div ref={setObserverTarget} className="h-10 w-full mt-4" />
          )}

          {/* Loading indicator */}
          {visibleItems < mediaFiles.length && (
            <div className="text-center mt-6">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          )}
        </Gallery>
      </div>
    </main>
  );
};

PhotoGallery.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "order"])),
    },
  };
}

export default PhotoGallery;
