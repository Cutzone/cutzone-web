import { deleteImage, uploadFile } from "@/store/services/uploadFile";
import { useEffect, useState } from "react";
import { Progress } from "antd";
import Image from "next/image";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import { UploadMainImageProps } from "./types";

export default function UploadMainImage({
  downloadURL,
  setDownloadURL,
  formRegister,
  formErrors,
  mainImageError,
  setMainImageError,
  size,
  children,
  rounded
}: UploadMainImageProps) {
  const [imageFile, setImageFile] = useState<File>();

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleSelectedFile = (files: any) => {
    console.log(files);

    if (files[0].type !== "image/png" && files[0].type !== "image/jpeg") {
      setMainImageError("O arquivo deve ser uma imagem PNG ou JPG");
      return;
    }

    if (files && files[0].size < 10000000) {
      if (imageFile) {
        deleteImage(imageFile.name);
      }

      setImageFile(files[0]);

      console.log(files[0]);
    } else {
      setMainImageError("O arquivo deve ser menor que 10MB");
    }
  };

  useEffect(() => {
    async function upload() {
      if (imageFile === undefined) return;

      await uploadFile(imageFile, setUploadProgress, setDownloadURL);
    }
    upload();
  }, [imageFile, setDownloadURL]);

  useEffect(() => {
    if (downloadURL !== "") {
      setMainImageError("");
    }
  }, [downloadURL, setMainImageError]);

  console.log(mainImageError);

  return (
    <div>
      <label htmlFor="upload" className="mb-2 flex flex-col items-center">
        {downloadURL === "" ? (
          <div
            className={`group relative flex ${
              size === "large" ? "h-40 w-40" : "h-24 w-24"
            } cursor-pointer items-center justify-center ${
              rounded ? "rounded-full" : "rounded"
            }  bg-gray-200 transition-all hover:bg-gray-400`}
          >
            <p className="text-gray-600 group-hover:text-gray-800">
              {children}
            </p>
            <div
              className={`absolute  flex ${
                size === "large"
                  ? "bottom-2 right-2 h-8 w-8"
                  : rounded
                  ? "bottom-1 right-1 h-6 w-6"
                  : "bottom-[-5px] right-[-5px] h-6 w-6"
              } items-center justify-center rounded-full bg-primary-amber`}
            >
              <EditOutlined className="text-white" />
            </div>
          </div>
        ) : (
          <div
            className={`group relative flex ${
              size === "large" ? "h-40 w-40" : "h-24 w-24"
            } cursor-pointer ${rounded ? "rounded-full" : "rounded"}`}
          >
            <Image
              src={downloadURL}
              alt="barbearia"
              width={160}
              height={160}
              objectFit="cover"
              className={`transition-all hover:opacity-70 ${
                rounded ? "rounded-full" : "rounded"
              }`}
            />
            <div
              className={`absolute ${
                size === "large"
                  ? "bottom-2 right-2 h-8 w-8"
                  : rounded
                  ? "bottom-1 right-1 h-6 w-6"
                  : "bottom-[-5px] right-[-5px] h-6 w-6"
              } flex items-center justify-center rounded-full bg-primary-amber group-hover:opacity-95`}
            >
              <EditOutlined className="text-white" />
            </div>
          </div>
        )}
      </label>

      {!!uploadProgress && uploadProgress !== 100 && (
        <Progress
          percent={uploadProgress}
          showInfo={false}
          strokeColor="#B7864B"
        />
      )}

      {mainImageError !== "" && (
        <FormErrorLabel>{mainImageError}</FormErrorLabel>
      )}
      <input
        // {...formRegister("mainImage", {
        //   required: "Recipe picture is required"
        // })}
        type="file"
        id="upload"
        className="hidden"
        placeholder="Select file to upload"
        accept="image/png image/jpeg image/jpg"
        onChange={(files) => handleSelectedFile(files.target.files)}
      />
    </div>
  );
}
