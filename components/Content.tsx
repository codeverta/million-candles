import { Modal, Rating } from "@mui/material";
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRelationships, toCurrency, useLoaded } from "utils";
import Skeleton from "components/flowbite/Skeleton";
import api from "utils/api";
import Link from "next/link";

export default function Content({ title = "Produk Kami" }) {
  const productParams = {
    "page[size]": 9,
    include: "documents",
  };
  const query: UseQueryResult<any> = useQuery({
    queryKey: ["products"],
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

  return (
    <>
      <main className="bg-white min-h-screen dark:bg-gray-900 pt-24">
        <h2 className="text-center mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        <ul className="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 max-w-4xl w-4/5 m-auto py-10">
          {query.isLoading || query.isError ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((it: number) => {
                return (
                  <div key={it} className="text-center">
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
                  <li className="transition-all hover:shadow-xl max-w-xs border border-gray-200 bg-white rounded dark:shadow-gray-800 dark:hover:shadow-gray-800 shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <button className="mx-auto w-full">
                        {isDocumentExist ? (
                          <img
                            className="rounded h-40 w-full object-contain"
                            src={
                              process.env.NEXT_PUBLIC_BASE +
                              "/storage/" +
                              documents[0]?.attributes.filename
                            }
                            alt="product image"
                            onError={(e: any) =>
                              (e.target.src = "/assets/image-1@2x.jpg")
                            }
                          />
                        ) : (
                          <img
                            className="rounded h-40 w-full object-contain"
                            src="/assets/image-1@2x.jpg"
                            alt="product image"
                          />
                        )}
                      </button>
                      <div className="px-5 pb-5">
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                          {product.attributes.name}
                        </h5>
                        <p className="flex items-center gap-1 dark:text-gray-200 text-gray-700">
                          <Rating
                            id={`product-${product.attributes.name}`}
                            name="simple-controlled"
                            max={1}
                            value={1}
                            onChange={(event, newValue) => {
                              // setStat(newValue);
                            }}
                          />
                          <span>5.0</span>| <span>Terjual 1 rb+</span>
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                            {toCurrency(product.attributes.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </main>
    </>
  );
}
