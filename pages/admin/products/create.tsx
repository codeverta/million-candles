import { List, ListItem, TextField, Button, IconButton } from "@mui/material";
import { useEffect } from "react";
import AdminLayout from "components/layout/AdminLayout";
import React, { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Cancel } from "@mui/icons-material";
import api from "utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";
import ReorderableFileUpload from "components/molecules/ReorderableFileUpload";

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
      fetchProduct(id as string);
    }
    return () => {};
  }, []);

  const fetchProduct = (id: string | number) => {
    api.get(`products/${id}`, productParams).then((res: any) => {
      setState({
        ...state,
        ...res.data.data.attributes,
        product: res.data,
      });
    });
  };

  const onAddFile = () => {};

  const changeProductCategory = (
    _e: any,
    val: { label: string; value: string }
  ) => {
    setState({ ...state, productCategoryId: val?.value });
  };

  const onProcessFile = () => {};

  const onChangeProductVariant = ({ value }: { value: string }) => {
    const newVal = String(value.split(","));
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
          price: parseInt(state.price),
          stock: parseInt(state.stock),
        },
        relationships: {
          "product-categories": {
            data: {
              type: "product-categories",
              // id: state.productCategoryId,
              id: "1",
            },
          },
        },
      },
    };
    try {
      if (productId) {
        api.patch(`products/${productId}`, payload);
        const batchReq = files.map((it: any) => {
          const formData = new FormData();
          formData.append("documentable_type", "products");
          formData.append("documentable_id", productId as string);
          formData.append("image", it);
          return api.post("documents/-actions/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        });

        await Promise.all(batchReq);
        toast.success("Produk Berhasil Diubah");
      } else {
        const res = await api.post("products", payload);

        const batchReq = files.map((it: any) => {
          const formData = new FormData();
          formData.append("documentable_type", "products");
          formData.append("documentable_id", res.data.data.id);
          formData.append("image", it);
          return api.post("documents/-actions/upload", formData);
        });

        await Promise.all(batchReq);
        toast.success("Produk Berhasil Ditambahkan");
      }

      router.push("/admin/products");
    } catch (error) {
      toast.error("Produk Gagal Ditambahkan");
    }
  };

  const deleteDocument = (id: string) => {
    api.delete(`-actions/documents/${id}`).then((res) => {
      toast.success(JSON.stringify(res.data));
      fetchProduct(router.query.id as string);
    });
  };

  const onChangeFile = (files: any) => {
    console.log({ files });
    setFiles(files);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitProduct)}>
      <List className="pb-32">
        <ListItem>
          <ReorderableFileUpload files={files} onChangeFile={onChangeFile} />
        </ListItem>
        <ListItem className="grid grid-cols-4 gap-4">
          {router.query.id && state.product && (
            <>
              {state.product.included
                .filter((it: any) => it.type == "documents")
                .map((it: any) => {
                  return (
                    <span key={it.id} className="relative">
                      <IconButton
                        onClick={() => deleteDocument(it.id)}
                        className="!absolute -top-5 -left-4"
                      >
                        <Cancel className="text-red-500" />
                      </IconButton>
                      <img
                        height={100}
                        className="!h-20 !w-20 object-contain border rounded shadow"
                        src={it.attributes.filename}
                      />
                    </span>
                  );
                })}
            </>
          )}
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
            type="number"
            placeholder="Masukkan Harga"
            helperText="Wajib diisi"
            value={state.price}
            onChange={(e) => setState({ ...state, price: e.target.value })}
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label="Stok"
            placeholder="Stok"
            value={state.stock}
            type="number"
            onChange={(e) => setState({ ...state, stock: e.target.value })}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full bg-blue-500"
            title="Tambah Produk"
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
