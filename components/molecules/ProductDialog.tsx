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

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

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
  const queryClient: any = useGetFetchQuery(["products"]);
  const getDocuments = getRelationships(
    queryClient?.data,
    props.product,
    "documents"
  );

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
            <Button autoFocus color="inherit">
              Beli
            </Button>
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
            <div className="font-bold flex justify-between">
              <p>Rp {props.product.attributes.price}</p>
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
      </Dialog>
    </div>
  );
}
