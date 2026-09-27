import {
  List,
  ListItem,
  TextField,
  Button,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import ProductVariantComponent from "./ProductVariantComponent";

const locales = Object.entries({
  ar: "Arabic",
  bn: "Bengali",
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  id: "Indonesian",
  ja: "Japanese",
  kr: "Korean",
  ms: "Malay",
  ru: "Russian",
  pt: "Portuguese",
  th: "Thai",
  vi: "Vietnamese",
  zh: "Mandarin",
  hi: "Hindi",
}).map(([code, name]) => ({
  code,
  name,
}));

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
  const [reviewDraft, setReviewDraft] = useState({
    author_name: "",
    rating: 5,
    review: "",
  });
  const [savingReview, setSavingReview] = useState(false);
  const [variantData, setVariantData] = useState<any>({
    variants: [],
    combinations: [],
  });
  const handleVariantChange = useCallback((value: any) => {
    setVariantData(value);
  }, []);

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
      await api.put(`products/${newProductId}/variants/-actions/sync`, {
        variants: variantData.variants,
        combinations: variantData.combinations.map((combination: any) => ({
          id: combination.id || null,
          sku: combination.sku?.trim() || null,
          price: Number(combination.price),
          stock: Number(combination.stock),
          option_keys: combination.optionKeys,
        })),
      });
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
    const translations = Object.entries(productTranslations)
      .map(([locale, translation]: [string, any]) => ({
        locale,
        name: translation?.name?.trim() || "",
        description: translation?.description || "",
      }))
      .filter((translation) => translation.name);

    if (translations.length === 0) return;

    try {
      await api.post("product-translations/-actions/bulk-upsert", {
        product_id: productId,
        translations,
      });
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

  const createReview = async () => {
    const productId = router.query.id;
    if (
      !productId ||
      !reviewDraft.author_name.trim() ||
      reviewDraft.review.trim().length < 10
    ) {
      toast.error("Isi nama pelanggan dan ulasan minimal 10 karakter.");
      return;
    }

    setSavingReview(true);
    try {
      await api.post(`products/${productId}/reviews`, {
        author_name: reviewDraft.author_name.trim(),
        rating: Number(reviewDraft.rating),
        review: reviewDraft.review.trim(),
      });
      setReviewDraft({ author_name: "", rating: 5, review: "" });
      await fetchProduct(productId as string);
      toast.success("Ulasan berhasil ditambahkan dan ditampilkan.");
    } catch (_error) {
      toast.error("Ulasan gagal disimpan.");
    } finally {
      setSavingReview(false);
    }
  };

  const deleteReview = async (reviewId: number | string) => {
    try {
      await api.delete(`reviews/${reviewId}`);
      await fetchProduct(router.query.id as string);
      toast.success("Ulasan berhasil dihapus.");
    } catch (_error) {
      toast.error("Ulasan gagal dihapus.");
    }
  };

  const onChangeFile = (files: any) => {
    setFiles(files);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitProduct)}>
      <List className="pb-32">
        <ListItem>
          <ReorderableFileUpload
            files={files}
            onChangeFile={onChangeFile}
            onError={(message: string) => toast.error(message)}
          />
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
          <ProductVariantComponent
            key={state.product?.data?.id || "new-product"}
            existingVariants={
              state.product?.data?.attributes?.product_variants || []
            }
            existingCombinations={
              state.product?.data?.attributes?.variant_combinations || []
            }
            onChange={handleVariantChange}
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
        {router.query.id && state.product && (
          <>
            <ListItem>
              <Divider className="w-full" />
            </ListItem>
            <ListItem>
              <div>
                <Typography variant="h6">Ulasan Produk</Typography>
                <Typography variant="body2" color="textSecondary">
                  Ulasan yang disimpan langsung tampil di halaman produk dan
                  JSON-LD.
                </Typography>
              </div>
            </ListItem>
            <ListItem>
              <TextField
                className="w-full"
                label="Nama pelanggan"
                value={reviewDraft.author_name}
                onChange={(event) =>
                  setReviewDraft({
                    ...reviewDraft,
                    author_name: event.target.value,
                  })
                }
              />
            </ListItem>
            <ListItem>
              <TextField
                select
                className="w-full"
                label="Rating"
                value={reviewDraft.rating}
                onChange={(event) =>
                  setReviewDraft({
                    ...reviewDraft,
                    rating: Number(event.target.value),
                  })
                }
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating} dari 5 bintang
                  </MenuItem>
                ))}
              </TextField>
            </ListItem>
            <ListItem>
              <TextField
                className="w-full"
                label="Isi ulasan"
                multiline
                minRows={3}
                value={reviewDraft.review}
                onChange={(event) =>
                  setReviewDraft({ ...reviewDraft, review: event.target.value })
                }
              />
            </ListItem>
            <ListItem>
              <Button
                type="button"
                variant="contained"
                color="primary"
                className="w-full bg-blue-500"
                disabled={savingReview}
                onClick={createReview}
              >
                {savingReview ? "Menyimpan..." : "Tambah Ulasan"}
              </Button>
            </ListItem>
            <ListItem>
              <div className="w-full space-y-3">
                {(state.product.data?.attributes?.product_reviews || []).map(
                  (review: any) => (
                    <div
                      key={review.id}
                      className="flex items-start justify-between gap-4 rounded border p-3"
                    >
                      <div>
                        <Typography variant="subtitle2">
                          {review.author_name ||
                            review.user?.name ||
                            "Pelanggan"}{" "}
                          · {review.rating}/5
                        </Typography>
                        <Typography variant="body2">{review.review}</Typography>
                      </div>
                      <Button
                        type="button"
                        color="error"
                        size="small"
                        onClick={() => deleteReview(review.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  )
                )}
              </div>
            </ListItem>
          </>
        )}
      </List>
    </form>
  );
}

CreateProduct.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateProduct;
