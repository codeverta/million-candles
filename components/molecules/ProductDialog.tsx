import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { getRelationships } from "utils";
import { useGetFetchQuery } from "utils/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMutation } from "@tanstack/react-query";
import api from "utils/api";
import {
  BottomNavigation,
  BottomNavigationAction,
  ButtonBase,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { useRouter } from "next/router";
import { toast } from "sonner";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PropsI {
  open: boolean;
  handleClose: any;
  product: any;
}

export default function ProductDialog(props: PropsI) {
  const router = useRouter();
  const createCart = useMutation((payload: any) => {
    return api.post(`carts`, payload);
  });
  const queryClient: any = useGetFetchQuery(["products"]);
  const getDocuments = getRelationships(
    queryClient?.data,
    props.product,
    "documents"
  );

  const handleCreateCart = async () => {
    const payload = {
      data: {
        type: "carts",
        attributes: {
          quantity: 1,
        },
        relationships: {
          products: {
            data: {
              type: "products",
              id: props.product.id,
            },
          },
        },
      },
    };

    await createCart.mutate(payload);
    toast.success("Produk Berhasil Ditambahkan ke Keranjang");
  };

  console.log({ getDocuments });
  return (
    <div>
      <Dialog
        scroll="body"
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Detail Produk
            </Typography>
          </Toolbar>
        </AppBar>
        {getDocuments.length > 0 ? (
          <>
            <Swiper
              slidesPerView="auto"
              pagination={{
                clickable: true,
              }}
            >
              {getDocuments.map((document: any) => (
                <SwiperSlide key={document.id} className="mx-1/2 max-w-xs p-1">
                  <img
                    key={document.id}
                    src={`${process.env.NEXT_PUBLIC_BASE}/storage/${document.attributes.filename}`}
                    onError={(e: any) =>
                      (e.target.src = "/assets/image-1@2x.jpg")
                    }
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : null}

        <article className="mx-2">
          <div className="text-lg text-gray-900 md:text-xl ">
            <h3 className="font-semibold ">{props.product.attributes.name}</h3>
            <div className="font-bold text-2xl mb-4 flex justify-between">
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(props.product.attributes.price)}
              </p>
            </div>
          </div>

          <dl>
            <dt className="mb-2 font-semibold leading-none text-gray-900 ">
              Details
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7
              processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory,
              Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage,
              Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
            </dd>
            <dt className="mb-2 font-semibold leading-none text-gray-900 ">
              Category
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              Electronics/PC
            </dd>
          </dl>
        </article>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItem>
        </List>
        <List className="fixed px-4 bg-white border-2 flex w-screen justify-center bottom-0">
          <Button size="medium" variant="outlined" className="mr-4">
            Beli Langsung
          </Button>
          <Button
            onClick={handleCreateCart}
            size="medium"
            variant="contained"
            className="bg-blue-500"
            color="primary"
          >
            <AddIcon /> Keranjang
          </Button>
        </List>
      </Dialog>
    </div>
  );
}
