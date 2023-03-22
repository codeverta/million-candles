import { Button, ButtonBase, List, ListItem, TextField } from "@mui/material";
import AdminLayout from "components/layout/AdminLayout";
import React, { useState } from "react";

function CreateUser() {
  const [state, setState] = useState({
    user: {
      id: "",
      attributes: {},
    },
  });
  return (
    <div>
      <List>
        <ListItem>
          <TextField
            className="w-full"
            label="Email"
            placeholder="Masukkan Email"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Nama"
            placeholder="Masukkan Nama"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Password"
            placeholder="Masukkan Password"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Konfirmasi Password"
            placeholder="Masukkan Konfirmasi Password"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            className="w-full bg-blue-500"
            title="Tambah Pengguna"
          >
            Tambah Pengguna
          </Button>
        </ListItem>
      </List>
    </div>
  );
}

CreateUser.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateUser;
