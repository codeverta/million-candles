import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { List, ListItem } from "@mui/material";

export default function PasswordDialog(props: any) {
  const { open, handlePasswordDialog } = props;

  return (
    <div>
      <Dialog open={open} onClose={handlePasswordDialog} fullWidth>
        <DialogTitle>Ubah Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <List>
              <ListItem>
                <TextField
                  fullWidth
                  className="w-full"
                  label="Password"
                  placeholder="Masukkan Password"
                  helperText="Wajib diisi"
                />
              </ListItem>
              <ListItem>
                <TextField
                  fullWidth
                  className="w-full"
                  label="Konfirmasi Password"
                  placeholder="Masukkan Konfirmasi Password"
                  helperText="Wajib diisi"
                />
              </ListItem>
              <ListItem className="flex justify-end">
                <Button>Simpan</Button>
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
