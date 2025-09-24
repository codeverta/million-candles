import {
  List,
  ListItem,
  TextField,
  Button,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "components/layout/AdminLayout";
import React from "react";
import { useForm } from "react-hook-form";
import { Cancel } from "@mui/icons-material";
import api from "utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";
import ReorderableFileUpload from "components/molecules/ReorderableFileUpload";
import { MenuItem } from "@mui/material";

const locales = [
  { code: "en", name: "English" },
  { code: "id", name: "Indonesian" },
  { code: "zh", name: "Mandarin" },
];

const productParams = {
  include: "documents,product-categories",
};

function CreateProduct() {
  const router = useRouter();
  const { handleSubmit } = useForm();
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
    description: "",
    productCategoryId: "",
    product: null,
  });

  const [productTranslations, setProductTranslations] = useState({});
  const [selectedLocale, setSelectedLocale] = useState("en");

  const fetchProduct = async (id: string | number) => {
    try {
      const res = await api.get(`products/${id}`, productParams);
      const productData = res.data.data.attributes;
      setState({
        ...state,
        ...productData,
        product: res.data,
      });

      const translationsResponse = await api.get(
        `product-translations?filter[product_id]=${res.data.data.id}`
      );
      const translationsData = {};
      translationsResponse.data.data.forEach((t) => {
        translationsData[t.attributes.locale] = {
          name: t.attributes.name,
          description: t.attributes.description,
        };
      });
      setProductTranslations(translationsData);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      toast.error("Failed to load product data.");
    }
  };

  useEffect(() => {
    const id = router.query.id;
    if (id) {
      fetchProduct(id as string);
    }
  }, [router.query.id]);

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
              id: "1",
            },
          },
        },
      },
    };

    try {
      let newProductId;

      if (productId) {
        await api.patch(`products/${productId}`, payload);
        newProductId = productId;
        toast.success("Produk Berhasil Diubah");
      } else {
        const res = await api.post("products", payload);
        newProductId = res.data.data.id;
        toast.success("Produk Berhasil Ditambahkan");
      }
      await saveProductTranslations(newProductId);
      const batchReq = files.map((it: any) => {
        const formData = new FormData();
        formData.append("documentable_type", "products");
        formData.append("documentable_id", newProductId as string);
        formData.append("image", it);
        return api.post("documents/-actions/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      await Promise.all(batchReq);
    } catch (error) {
      console.error(error);
      toast.error("Produk Gagal Ditambahkan");
    }
  };

  const saveProductTranslations = async (productId) => {
    try {
      const translationPromises = locales.map(async (locale) => {
        const translation = productTranslations[locale.code];
        if (translation && (translation.name || translation.description)) {
          const payload = {
            data: {
              type: "product-translations",
              attributes: {
                locale: locale.code,
                name: translation.name,
                description: translation.description,
                "product-id": productId,
              },
            },
          };
          const existingTranslations = await api.get(
            `product-translations?filter[product_id]=${productId}&filter[locale]=${locale.code}`
          );
          if (existingTranslations.data.data.length > 0) {
            const translationId = existingTranslations.data.data[0].id;
            return api.patch(`product-translations/${translationId}`, payload);
          } else {
            return api.post("product-translations", payload);
          }
        }
      });
      await Promise.all(translationPromises.filter(Boolean));
      toast.success("Product translations saved successfully");
    } catch (error) {
      console.error("Error saving translations:", error);
      toast.error("Failed to save product translations");
    }
  };

  const deleteDocument = (id: string) => {
    api.delete(`-actions/documents/${id}`).then((res) => {
      toast.success(JSON.stringify(res.data));
      fetchProduct(router.query.id as string);
    });
  };

  const onChangeFile = (files: any) => {
    setFiles(files);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitProduct)}>
      <List className="pb-32">
        <ListItem>
          <ReorderableFileUpload files={files} onChangeFile={onChangeFile} />
        </ListItem>
        <ListItem className="grid grid-cols-4 flex-wrap gap-4">
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
          <Typography variant="h6">Terjemahan Produk</Typography>
        </ListItem>
        <ListItem>
          <TextField
            select
            label="Pilih Bahasa"
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="w-full"
          >
            {locales.map((locale) => (
              <MenuItem key={locale.code} value={locale.code}>
                {locale.name}
              </MenuItem>
            ))}
          </TextField>
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label={`Nama Produk (${
              locales.find((l) => l.code === selectedLocale)?.name
            })`}
            placeholder="Masukkan Nama Produk"
            helperText="Wajib diisi"
            value={productTranslations[selectedLocale]?.name || ""}
            onChange={(e) =>
              setProductTranslations({
                ...productTranslations,
                [selectedLocale]: {
                  ...productTranslations[selectedLocale],
                  name: e.target.value,
                },
              })
            }
          />
        </ListItem>
        <ListItem>
          <TextField
            className="w-full"
            label={`Deskripsi Produk (${
              locales.find((l) => l.code === selectedLocale)?.name
            })`}
            placeholder="Masukkan Deskripsi Produk"
            multiline
            minRows={2}
            value={productTranslations[selectedLocale]?.description || ""}
            onChange={(e) =>
              setProductTranslations({
                ...productTranslations,
                [selectedLocale]: {
                  ...productTranslations[selectedLocale],
                  description: e.target.value,
                },
              })
            }
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
