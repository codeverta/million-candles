import { List, ListItem, TextField, Button, Autocomplete } from "@mui/material";
import AdminLayout from "components/layout/AdminLayout";
import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

function CreateProduct() {
  const [state, setState] = useState({
    name: "",
    weight: "",
    price: 0,
    variantInput: "",
  });
  const [variantDropdown, setVariantDropdown] = useState({
    value: "",
    selected: [],
    options: [
      {
        value: "Tambahkan Produk",
      },
    ],
  });

  const changeDropdown = (val: any) => {
    console.log({ val });
  };
  return (
    <>
      <List>
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
            label="Harga"
            placeholder="Masukkan Harga"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Berat"
            placeholder="Masukkan Berat"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Ukuran"
            placeholder="Ukuran"
            helperText="Wajib diisi"
          />
        </ListItem>
        <ListItem>
          <Autocomplete
            multiple
            className="!w-full"
            id="tags-outlined"
            options={variantDropdown.options as any}
            getOptionLabel={(option: any) => option.value}
            defaultValue={variantDropdown.selected}
            onChange={changeDropdown}
            filterSelectedOptions
            renderInput={(params) => {
              // setVariantDropdown({
              //   ...variantDropdown,
              //   options: [{ value: `Tambahkan ${params.inputProps.value}` }],
              // });
              return (
                <TextField
                  {...params}
                  label="Varian Produk"
                  placeholder="Varian"
                />
              );
            }}
          />
        </ListItem>
        <ListItem>
          <FilePond
            allowMultiple={true}
            maxFiles={3}
            acceptedFileTypes={["image/png", "image/jpeg"]}
          />
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            className="w-full bg-blue-500"
            title="Tambah Produk"
          >
            Tambah Produk
          </Button>
        </ListItem>
      </List>
    </>
  );
}

CreateProduct.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateProduct;
