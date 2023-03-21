import { useState } from "react";
import Link from "next/link";
import Login from "./molecules/Login";
import { Modal } from "@mui/material";
import Drawer from "./flowbite/Drawer";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";
import Banner from "./flowbite/Banner";

interface Route {
  label: String;
  url: String;
}

export default function Header() {
  const [menus] = useState<Route[]>([
    {
      label: "Home",
      url: "/",
    },
    {
      label: "Produk",
      url: "/products",
    },
    {
      label: "Alamat",
      url: "/address",
    },
    {
      label: "Blog",
      url: "/posts",
    },
    {
      label: "Tentang",
      url: "/about",
    },
  ]);
  const [open, setOpen] = useState({
    drawer: false,
    login: false,
  });
  const nodeRef = useRef(null);

  const handleOpenLogin = () => {
    setOpen({ ...open, login: !open.login });
  };
  const handleDrawer = () => {
    setOpen({ ...open, drawer: !open.drawer });
  };
  return (
    <header>
      {open.login && (
        <Modal
          open={open.login}
          onClose={handleOpenLogin}
          aria-labelledby="modal-login"
          aria-describedby="parent-modal-description"
          className="grid h-screen place-items-center"
        >
          <div>
            <Login />
          </div>
        </Modal>
      )}

      {open.drawer && <Drawer handleDrawer={handleDrawer} />}

      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-around sm:justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <img
              src="/favicon-xl.png"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Million Candles
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <button
              onClick={handleOpenLogin}
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Log in
            </button>
            <button
              data-collapse-toggle="mobile-menu-2"
              type="button"
              onClick={handleDrawer}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
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
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {menus.map((menu: any, index) => (
                <li key={index}>
                  <Link
                    href={menu.url}
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <Banner />
    </header>
  );
}
