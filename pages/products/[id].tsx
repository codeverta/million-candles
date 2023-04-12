import React from "react";
import Layout from "components/layout/Landing";

function ProductDetail() {
  return (
    <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
      <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <div className="flex justify-between mb-4 rounded-t sm:mb-5">
          <div className="text-lg text-gray-900 md:text-xl dark:text-white">
            <h3 className="font-semibold ">Apple iMac 27”</h3>
            <p className="font-bold">$2999</p>
          </div>
        </div>
        <dl>
          <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
            Details
          </dt>
          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7
            processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory,
            Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage,
            Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
          </dd>
          <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
            Category
          </dt>
          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            Electronics/PC
          </dd>
        </dl>
      </div>
    </div>
  );
}

ProductDetail.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default ProductDetail;
