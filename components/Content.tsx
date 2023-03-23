import { Modal, Rating } from "@mui/material";
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRelationships, toCurrency, useLoaded } from "utils";
import api from "utils/api";

const productParams = {
  "page[size]": 6,
  include: "documents",
};

export default function Content() {
  const loaded = useLoaded();
  const query: UseQueryResult<any> = useQuery({
    queryKey: ["products"],
    queryFn: () => {
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
    <div>
      {state.isModalOpen && loaded && (
        <Modal
          open={state.isModalOpen && loaded}
          onClose={handleModal}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          className="grid h-screen w-3/5 m-auto place-items-center"
        >
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms of Service
              </h3>
              <button
                onClick={handleModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-6 space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                With less than a month to go before the European Union enacts
                new consumer privacy laws for its citizens, companies around the
                world are updating their terms of service agreements to comply.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                The European Union’s General Data Protection Regulation
                (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                common set of data rights in the European Union. It requires
                organizations to notify users as soon as possible of high-risk
                data breaches that could personally affect them.
              </p>
            </div>
            {/* <!-- Modal footer --> */}
            <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                I accept
              </button>
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Decline
              </button>
            </div>
          </div>
        </Modal>
      )}
      <main className="bg-white min-h-screen dark:bg-gray-900">
        <h2 className="text-center mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Produk Kami
        </h2>
        <article className="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-4/5 m-auto py-10">
          {query.isLoading || query.isError ? (
            <div>Loading...</div>
          ) : (
            <>
              {" "}
              {query.data.data.data.map((product: any, index: number) => {
                const documents =
                  product.relationships.documents.data.length > 0
                    ? getRelationships(query.data.data, product, "documents")
                    : [];
                const isDocumentExist = !!documents[0]?.attributes.filename;
                return (
                  <div
                    key={product.id}
                    className="w-full max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
                  >
                    <button onClick={() => handleModal(product)}>
                      {isDocumentExist ? (
                        <img
                          className="rounded-t-xl"
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
                          className="rounded-t-xl"
                          src="/assets/image-1@2x.jpg"
                          alt="product image"
                        />
                      )}
                    </button>
                    <div className="px-5 pb-5">
                      <a href="#">
                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                          {product.attributes.name}
                        </h5>
                      </a>
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
                        <a
                          href="#"
                          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                          Keranjang
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </article>
      </main>
    </div>
  );
}
