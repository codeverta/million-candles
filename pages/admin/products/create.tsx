import { List, ListItem, TextField, Button, Autocomplete } from "@mui/material";
import AdminLayout from "components/layout/AdminLayout";
import React, { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import api from "utils/api";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode
);

function CreateProduct() {
  const productFileRef = useRef<null | any>(null);
  const [files, setFiles] = useState<any>([]);
  const [state, setState] = useState({
    name: "",
    weight: "",
    price: 0,
    variantInput: "",
    description: "",
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

  const onAddFile = () => {
    console.log(files[0].getFileEncodeBase64String());
    console.log({ productFileRef });
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
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Harga"
            placeholder="Masukkan Harga"
            helperText="Wajib diisi"
            onChange={(e) =>
              setState({ ...state, price: parseInt(e.target.value) })
            }
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Berat"
            placeholder="Masukkan Berat"
            helperText="Wajib diisi"
            onChange={(e) => setState({ ...state, weight: e.target.value })}
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
            multiline
            minRows={2}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
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
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={10}
            onaddfile={onAddFile}
            name="files"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
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
