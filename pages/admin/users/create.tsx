import { List, ListItem, TextField } from "@mui/material";
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
            focused
            label="Email"
            placeholder="Masukkan Email"
            helperText="Wajib diisi"
          />
        </ListItem>
      </List>
    </div>
  );
}

CreateUser.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateUser;
