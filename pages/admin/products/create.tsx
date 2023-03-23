import { List, ListItem, TextField, Button, Autocomplete } from "@mui/material";
import AdminLayout from "components/layout/AdminLayout";
import React, { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import api from "utils/api";

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

  const onSubmitProduct = async () => {
    const payload = {
      data: {
        type: "products",
        attributes: {
          description:
            "In our second blog post, you will learn how to create resources using the JSON:API specification.",
          name: "How to Create JSON:API Resources",
          price: 20000,
        },
        relationships: {
          "product-categories": {
            data: {
              type: "product-categories",
              id: "2",
            },
          },
        },
      },
    };

    await api.post("products", payload);
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
          <TextField
            className="w-full"
            label="Deskripsi"
            placeholder="Deskripsi"
            rows={4}
            multiline
            minRows={2}
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
