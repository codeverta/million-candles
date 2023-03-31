import {
  List,
  ListItem,
  TextField,
  Button,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { useEffect } from "react";
import AdminLayout from "components/layout/AdminLayout";
import React, { useMemo, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { useForm } from "react-hook-form";
import { Cancel } from "@mui/icons-material";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import api from "utils/api";
import SearchInput from "components/mui/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
const productParams = {
  include: "documents,product-categories",
};
function CreateProduct() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const productFileRef = useRef<null | any>(null);
  const getProductCategory = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => {
      return api.get("product-categories");
    },
  });
  const productCategoryGate =
    getProductCategory.isError || getProductCategory.isLoading;
  const productCategoryOptions = useMemo(() => {
    if (productCategoryGate) {
      return [
        {
          label: "",
          value: "",
        },
      ];
    }
    return getProductCategory.data.data.data.map((it: any) => ({
      label: `${it.attributes.name}`,
      value: it.id,
    }));
  }, [getProductCategory]);
  const [files, setFiles] = useState<any>([]);
  const [state, setState] = useState<any>({
    code: "",
    name: "",
    price: 0,
    stock: 0,
    variantInput: "",
    description: "",
    productCategoryId: "",
    product: null,
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

  useEffect(() => {
    if (router.query.id) {
      const id = router.query.id;
      api.get(`products/${id}`, productParams).then((res: any) => {
        setState({
          ...state,
          ...res.data.data.attributes,
          product: res.data,
        });
      });
    }
    return () => {};
  }, []);

  const onAddFile = () => {
    console.log({ productFileRef });
  };

  const changeProductCategory = (
    _e: any,
    val: { label: string; value: string }
  ) => {
    setState({ ...state, productCategoryId: val?.value });
  };

  const onProcessFile = () => {};

  const onChangeProductVariant = ({ value }: { value: string }) => {
    const newVal = String(value.split(","));
    console.log(newVal);
    if (value.endsWith(",")) {
      const tag = value.slice(0, -1).trim();
      if (tag) {
        setVariantDropdown({
          ...variantDropdown,
          // selected: [...variantDropdown.selected, tag],
        });
      }
    }
  };

  const onSubmitProduct = async () => {
    const productId = router.query.id;
    const payload = {
      data: {
        id: productId,
        type: "products",
        attributes: {
          code: state.code,
          description: state.description,
          name: state.name,
          price: state.price,
          stock: state.stock,
        },
        relationships: {
          "product-categories": {
            data: {
              type: "product-categories",
              id: state.productCategoryId,
            },
          },
        },
      },
    };
    try {
      if (productId) {
        api.patch(`products/${productId}`, payload);
        const batchReq = productFileRef.current.props.files.map((it: any) => {
          const formData = new FormData();
          formData.append("documentable_type", "products");
          formData.append("documentable_id", productId as string);
          formData.append("image", it.file);
          return api.post("documents/-actions/upload", formData);
        });

        await Promise.all(batchReq);
        toast.success("Produk Berhasil Diubah");
      } else {
        const res = await api.post("products", payload);

        const batchReq = productFileRef.current.props.files.map((it: any) => {
          const formData = new FormData();
          formData.append("documentable_type", "products");
          formData.append("documentable_id", res.data.data.id);
          formData.append("image", it.file);
          return api.post("documents/-actions/upload", formData);
        });

        await Promise.all(batchReq);
        toast.success("Produk Berhasil Ditambahkan");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error({ error });
      toast.error("Produk Gagal Ditambahkan");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitProduct)}>
      <List className="pb-32">
        <ListItem>
          <TextField
            className="w-full"
            label="Nama"
            placeholder="Masukkan Nama"
            helperText="Wajib diisi"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Harga"
            placeholder="Masukkan Harga"
            helperText="Wajib diisi"
            value={state.price}
            onChange={(e) =>
              setState({ ...state, price: parseInt(e.target.value) })
            }
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Kode"
            placeholder="Masukkan Kode"
            helperText="Wajib diisi"
            value={state.code}
            onChange={(e) => setState({ ...state, code: e.target.value })}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Stok"
            placeholder="Stok"
            value={state.stock}
            onChange={(e) =>
              setState({ ...state, stock: parseInt(e.target.value) })
            }
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
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
          />
        </ListItem>
        <ListItem>
          <SearchInput
            inputValue={state.product ? productCategoryOptions[0] : undefined}
            options={productCategoryOptions}
            getOptionLabel={(option: any) => option.label}
            onChange={changeProductCategory}
            label="Pilih Kategori"
            className="!w-full"
          />
        </ListItem>
        <ListItem>
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={10}
            onaddfile={onAddFile}
            onpreparefile={onProcessFile}
            name="files"
            onprocessfiles={onProcessFile}
            ref={productFileRef}
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </ListItem>
        <ListItem className="grid grid-cols-4 gap-4">
          {router.query.id && state.product && (
            <>
              {state.product.included
                .filter((it: any) => it.type == "documents")
                .map((it: any) => {
                  return (
                    <span key={it.id} className="relative">
                      <IconButton className="absolute -top-5 -left-4">
                        <Cancel className="text-red-500" />
                      </IconButton>
                      <img
                        height={100}
                        className="!h-20 !w-20 object-contain border rounded shadow"
                        src={
                          process.env.NEXT_PUBLIC_BASE +
                          "/storage/" +
                          it.attributes.filename
                        }
                      />
                    </span>
                  );
                })}
            </>
          )}
        </ListItem>
        <ListItem>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full bg-blue-500"
            title="Tambah Produk"
            disabled={!state.productCategoryId}
          >
            {router.query.id ? "Edit" : "Tambah"} Produk
          </Button>
        </ListItem>
      </List>
    </form>
  );
}

CreateProduct.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateProduct;
