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
            {getDocuments.map((document: any) => (
              <img
                key={document.id}
                src={`${process.env.NEXT_PUBLIC_BASE}/storage/${document.attributes.filename}`}
                onError={(e: any) => (e.target.src = "/assets/image-1@2x.jpg")}
              />
            ))}
          </>
        ) : null}
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
