import React from "react";

export default function Footer() {
  return (
    <footer className="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex mx-4 justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img width={60} height={60} className="mx-2" src="/favicon-xl.png" />
          Million Candles
        </a>
        <ul className="flex flex-wrap mt-4 justify-center items-center mb-6 text-gray-900 dark:text-white">
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              Whatsapp
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Instagram
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Facebook
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Tentang Kami
            </a>
          </li>
        </ul>
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2007-{new Date().getFullYear()}{" "}
          <a href="#" className="hover:underline">
            Million Candles™
          </a>
        </span>
      </div>
    </footer>
  );
}
