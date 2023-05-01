import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { Rating } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ProductDialog from "components/molecules/ProductDialog";
import { getRelationships, toCurrency } from "utils";
import { useGetFetchQuery } from "utils/hooks";
import LoadingBackdrop from "components/mui/LoadingBackdrop";

export default function ProductCard(props: any) {
  const getProducts: any = useGetFetchQuery(["products"]);
  const [state, setState] = React.useState({
    rating: [],
  });
  const root = React.useMemo(() => getProducts?.data, [getProducts]);
  const [open, setOpen] = React.useState({
    dialog: false,
  });

  const handleDialog = () => {
    setOpen({ ...open, dialog: !open.dialog });
  };

  if (!getProducts?.data) {
    return <LoadingBackdrop />;
  }

  const documents = getRelationships(root, props.product, "documents");
  return (
    <>
      {open.dialog && (
        <ProductDialog
          product={props.product}
          open={open.dialog}
          handleClose={handleDialog}
        />
      )}
      <Card onClick={handleDialog} sx={{ maxWidth: 200 }}>
        <CardMedia
          component="img"
          classes={{
            img: "!object-fit !h-[154px]",
          }}
          image={
            documents.length > 0
              ? `${process.env.NEXT_PUBLIC_BASE}/storage/${documents[0].attributes.filename}`
              : "/blah.png"
          }
          onError={(e: any) => (e.target.src = "/assets/image-1@2x.jpg")}
        />
        <CardContent
          classes={{
            root: "!px-3 py-1",
          }}
        >
          <div className="text-sm flex items-center max-w-full">
            <p className="truncate">{props.product.attributes.name}</p>
            <IconButton size="small" title="Terverifikasi Oleh Million Candles">
              <VerifiedIcon fontSize="small" color="primary" />
            </IconButton>
          </div>
          <p className="text-md font-bold">
            {toCurrency(props.product.attributes.price)}
          </p>
        </CardContent>
        <CardActions disableSpacing>
          <Rating
            name="simple-controlled"
            value={state.rating[0] ?? Math.floor(Math.random() * 5) + 1}
            onChange={(event, newValue) => {
              // setStat(newValue);
            }}
          />
        </CardActions>
      </Card>
    </>
  );
}
