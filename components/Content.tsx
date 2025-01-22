import { Modal, Pagination, Rating } from "@mui/material";
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRelationships, toCurrency, useLoaded } from "utils";
import Skeleton from "components/flowbite/Skeleton";
import api from "utils/api";
import Link from "next/link";

const ProductCard = ({ product, isDocumentExist, documents }: any) => (
  <div className="w-full p-2">
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
      <Link href={`/products/${product.attributes.slug}`}>
        <button className="mx-auto w-full">
          {isDocumentExist ? (
            <img
              className="w-full h-48 object-cover"
              src={
                process.env.NEXT_PUBLIC_BASE +
                "/storage/" +
                documents[0]?.attributes.filename
              }
              alt="product image"
              onError={(e: any) => (e.target.src = "/assets/image-1@2x.jpg")}
            />
          ) : (
            <img
              className="w-full h-48 object-cover"
              src="/assets/image-1@2x.jpg"
              alt="product image"
            />
          )}
        </button>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.attributes.slug}`}>
          <h3 className="text-md font-semibold hover:underline">
            {product.attributes.name} ({product.attributes.code})
          </h3>
        </Link>
        <div className="text-green-600 font-bold text-lg mb-2">
          {toCurrency(product.attributes.price)}
        </div>
        <div className="flex items-center">
          <span className="text-yellow-500 mr-2">★ 5.0</span>
          <span className="text-green-500 mr-2">1rb+ terjual</span>
        </div>
      </div>
    </div>
  </div>
);

export default function Content({ title = "Produk Kami" }) {
  const [currentPage, setCurrentPage] = useState(1);

  const productParams = {
    "page[size]": 12,
    include: "documents",
    "page[number]": currentPage,
  };
  const query: UseQueryResult<any> = useQuery({
    queryKey: ["products", currentPage],
    queryFn: async () => {
      return api.get("products", { ...productParams });
    },
    staleTime: 1000 * 60 * 10,
  });

  const [state, setState] = useState<any>({
    isModalOpen: false,
    isLoading: false,
    selectedProduct: {},
    rating: [],
  });

  const handleModal = (product: any): void => {
    setState({
      ...state,
      isModalOpen: !state.isModalOpen,
      selectedProduct: product,
    });
  };

  const onChangePage = (_e: any, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <main className="bg-white min-h-screen dark:bg-gray-900 pt-24">
        <h2 className="text-center mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        <span className="text-red-600 text-sm block max-w-md mx-auto">
          * Harga yang ditampilkan merupakan harga distributor/grosir
        </span>
        <ul className="mx-auto w-full md:w-3/4 p-4 grid grid-cols-12 gap-4">
          {query.isLoading || query.isError ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((it: number) => {
                return (
                  <div
                    key={it}
                    className="col-span-12 sm:col-span-4 lg:col-span-3 text-center"
                  >
                    <Skeleton />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {" "}
              {query.data.data.data.map((product: any, index: number) => {
                const documents =
                  product.relationships?.documents.data.length > 0
                    ? getRelationships(query.data.data, product, "documents")
                    : [];
                const isDocumentExist = !!documents[0]?.attributes.filename;
                return (
                  <li
                    data-aos="fade-up"
                    data-aos-delay={`${index * 100}`}
                    className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3"
                    key={product.attributes.slug}
                  >
                    <ProductCard
                      isDocumentExist={isDocumentExist}
                      product={product}
                      documents={documents}
                    />
                  </li>
                );
              })}
              <div className="flex col-span-12 justify-center">
                <Pagination
                  page={currentPage}
                  onChange={onChangePage}
                  variant="outlined"
                  color="primary"
                  count={query.data.data.meta.page.lastPage}
                />
              </div>
            </>
          )}
        </ul>
      </main>
    </>
  );
}
