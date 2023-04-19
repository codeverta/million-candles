import React, { FormEvent, useState, useEffect } from "react";
import Layout from "components/layout/Landing";
import Head from "next/head";
import { Backdrop } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "utils/api";
import GoogleCaptcha from "components/molecules/GoogleCaptcha";
import LoadingBackdrop from "components/mui/LoadingBackdrop";

function TrackOrder() {
  const queryClient = useQueryClient();
  const [state, setState] = useState({
    isModalOpen: false,
    isCaptchaSolved: false,
    order: {
      attributes: {
        code: "",
      },
    },
  });
  const searchOrder = useQuery<any>({
    queryKey: ["searchOrder"],
    queryFn: () => {
      try {
        return api.get("-actions/searchOrder", {
          code: state.order.attributes.code,
        });
      } catch (err) {
        return err;
      }
    },
    onSettled(data, error) {
      setState({ ...state, isModalOpen: false });
    },
    enabled: false,
    retry: false,
    staleTime: 1000 * 60 * 24,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setState({ ...state, isModalOpen: true, isCaptchaSolved: false });
  };

  const onSuccess = () => {
    setState({ ...state, isCaptchaSolved: true });
    queryClient.fetchQuery(["searchOrder"]);
  };

  return (
    <>
      {searchOrder.isLoading && state.isCaptchaSolved && <LoadingBackdrop />}
      {state.isModalOpen && (
        <Backdrop
          className="z-10"
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={state.isModalOpen}
          onClick={() => setState({ ...state, isModalOpen: false })}
        >
          <GoogleCaptcha onSuccess={onSuccess} />
        </Backdrop>
      )}
      <Head>
        <title>
          Cek Order | UD Million Candles - Produsen Lilin Aromaterapi Souvenir
          Lilin Jogja, Lilin Warna, Lilin Hias dan Lain-lain
        </title>
      </Head>
      <section className="bg-white flex min-h-screen dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md sm:text-center">
            <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">
              Cek Order
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">
              Pantau dan lacak ordermu menggunakan kode unik yang kamu dapatkan
              setelah memesan produk kami.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                <div className="relative w-full">
                  <label
                    htmlFor="email"
                    className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Kode Order
                  </label>
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    onInput={(e: any) =>
                      setState({
                        ...state,
                        order: { attributes: { code: e.target.value } },
                      })
                    }
                    className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Masukkan kode order"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Cek
                  </button>
                </div>
              </div>
              <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">
                Data yang sudah dinputkan akan muncul di bawah ini, jika
                memiliki kendala silakan hubungi penjual.
              </div>
            </form>
            <div className="text-gray-200">
              {searchOrder.data && searchOrder.data.data.length == 0 ? (
                <p className="text-red-300">Data order tidak ditemukan</p>
              ) : (
                <>
                  {" "}
                  {state.isCaptchaSolved && (
                    <ol className="text-left mt-8 relative border-l border-gray-200 dark:border-gray-700">
                      {[0, 1, 2, 3].map((order: any) => {
                        return (
                          <li className="mb-10 ml-4">
                            <div className="absolute animate-ping bg-yellow-600 w-3 h-3  rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900"></div>
                            <div className="absolute bg-yellow-600 w-3 h-3  rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                              February 2022
                            </time>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Application UI code in Tailwind CSS
                            </h3>
                            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                              Get access to over 20+ pages including a dashboard
                              layout, charts, kanban board, calendar, and
                              pre-order E-commerce & Marketing pages.
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

TrackOrder.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export default TrackOrder;
