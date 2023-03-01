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

export default function ProductCard(props: any) {
  const [state, setState] = React.useState({
    rating: [],
  });

  return (
    <Card sx={{ maxWidth: 200 }}>
      <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        onError={(e: any) => (e.target.src = "/assets/image-1@2x.jpg")}
      />
      <CardContent>
        <p className="text-sm">{props.product.attributes.name}</p>
        <p className="text-md font-bold">
          Rp. {props.product.attributes.price}
        </p>
        <Rating
          name="simple-controlled"
          value={state.rating[0] ?? Math.floor(Math.random() * 5) + 1}
          onChange={(event, newValue) => {
            // setStat(newValue);
          }}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton title="Terverifikasi Oleh Million Candles">
          <VerifiedIcon color="primary" />
        </IconButton>
      </CardActions>
    </Card>
  );
}
