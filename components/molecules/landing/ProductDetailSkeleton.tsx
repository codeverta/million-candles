import React from "react";

// Skeleton component for product details
const ProductDetailSkeleton = () => (
  <div className="w-full md:pl-10 lg:py-6 mt-6 lg:mt-0">
    <div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 opacity-60"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6 opacity-60"></div>

      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 opacity-60"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 opacity-60"></div>

      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6 opacity-60"></div>

      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6 opacity-60"></div>

      <div className="flex items-center">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32 mr-4 opacity-60"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-24 opacity-60"></div>
      </div>

      <div className="mt-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 opacity-60"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 opacity-60"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 opacity-60"></div>
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
