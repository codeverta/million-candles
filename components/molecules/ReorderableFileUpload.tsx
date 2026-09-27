import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILES = 9;
const MAX_INPUT_SIZE = 20 * 1024 * 1024;
const MAX_OUTPUT_SIZE = 5 * 1024 * 1024;
const INITIAL_MAX_DIMENSION = 2048;
const WEBP_QUALITIES = [0.82, 0.72, 0.62, 0.52];

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("File gambar tidak dapat dibaca."));
    };
    image.src = objectUrl;
  });

const encodeWebp = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(new Error("Browser tidak mendukung konversi WebP."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });

const optimizeAsWebp = async (
  file: File
): Promise<File & { preview: string }> => {
  const image = await loadImage(file);
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("Ukuran gambar tidak dapat dibaca.");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Browser tidak dapat memproses gambar.");
  }

  let maxDimension = INITIAL_MAX_DIMENSION;
  while (maxDimension >= 768) {
    const scale = Math.min(
      1,
      maxDimension / image.naturalWidth,
      maxDimension / image.naturalHeight
    );
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of WEBP_QUALITIES) {
      const blob = await encodeWebp(canvas, quality);
      if (blob.size <= MAX_OUTPUT_SIZE) {
        const baseName = file.name.replace(/\.[^.]+$/, "") || "product-image";
        const webpFile = new File([blob], `${baseName}.webp`, {
          type: "image/webp",
          lastModified: file.lastModified,
        });
        return Object.assign(webpFile, { preview: URL.createObjectURL(blob) });
      }
    }

    maxDimension = Math.floor(maxDimension * 0.8);
  }

  throw new Error("Ukuran gambar masih terlalu besar setelah dioptimalkan.");
};

const ReorderableFileUpload = ({ files, onChangeFile, onError }: any) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const onDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      onError?.(
        "Pilih gambar JPG, PNG, WebP, GIF, atau SVG (maks. 20 MB per file). Maksimal 9 gambar."
      );
    }

    const successfulFiles: Array<File & { preview: string }> = [];
    let failedFiles = 0;
    for (const file of acceptedFiles) {
      try {
        successfulFiles.push(await optimizeAsWebp(file));
      } catch (error) {
        failedFiles += 1;
      }
    }

    if (failedFiles > 0) {
      onError?.(
        "Sebagian gambar tidak bisa diproses. Coba simpan ulang gambar lalu unggah kembali."
      );
    }

    if (successfulFiles.length > 0) {
      onChangeFile([...files, ...successfulFiles].slice(0, MAX_FILES));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "image/svg+xml": [".svg"],
    },
    onDrop,
    multiple: true,
    maxFiles: Math.max(1, MAX_FILES - files.length),
    maxSize: MAX_INPUT_SIZE,
  });

  const removeFile = (fileToRemove: File & { preview?: string }) => {
    onChangeFile(files.filter((file: File) => file !== fileToRemove));
    if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
  };

  const moveFile = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reorderedFiles = [...files];
    const [draggedFile] = reorderedFiles.splice(draggedIndex, 1);
    reorderedFiles.splice(targetIndex, 0, draggedFile);
    onChangeFile(reorderedFiles);
    setDraggedIndex(targetIndex);
  };

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 text-sm mb-2">* Foto Produk</label>
      <p className="text-gray-500 text-xs mb-2">
        Gambar otomatis dioptimalkan dan dikonversi ke WebP saat dipilih.
      </p>
      <div className="flex items-center flex-wrap">
        {files.map((file: any, index: number) => (
          <div
            key={`${file.name}-${index}`}
            className="relative w-24 h-24 border rounded-lg overflow-hidden m-2"
            draggable
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(event) => {
              event.preventDefault();
              moveFile(index);
            }}
            onDragEnd={() => setDraggedIndex(null)}
          >
            <img
              src={file.preview}
              alt="Pratinjau foto produk"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(file)}
              className="absolute rotate-45 top-0 right-0 bg-red-500 text-white text-xs h-4 w-4 rounded-full"
              aria-label="Hapus gambar"
            >
              +
            </button>
          </div>
        ))}
        {files.length < MAX_FILES && (
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer m-2"
          >
            <input {...getInputProps()} />
            <span className="text-orange-600 text-center text-xs">
              Tambahkan Foto ({files.length}/{MAX_FILES})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReorderableFileUpload;
