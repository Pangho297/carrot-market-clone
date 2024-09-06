"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import {
  getProduct,
  getUploadUrl,
  updateProduct,
  uploadProduct,
} from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormType, productSchema } from "./schema";
import { useSearchParams } from "next/navigation";

export default function UploadProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isModify, setIsModify] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
  });

  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (!id) {
      setIsModify(false);
      return;
    }

    (async () => {
      const product = await getProduct(parseInt(id));

      if (!product) {
        setIsModify(false);
        return;
      }

      setIsModify(true);
      setValue("title", product.title);
      setValue("price", product.price);
      setValue("description", product.description);
      setPreview(`${product.photo}/public`);
      setValue("photo", product.photo);
    })();
  }, [id, setValue]);

  const onSubmit = handleSubmit(async (data: ProductFormType) => {
    // Cloudflare에 이미지 업로드
    // 파일 업로드 안된경우 방지
    if (!isModify) {
      if (!file) {
        return;
      }

      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });

      if (res.status !== 200) {
        return alert("이미지 업로드에 실패했습니다 다시 시도해주세요");
      }
    }

    // formData 생성
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", `${data.price}`);
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    if (isModify && id) {
      return updateProduct(formData, parseInt(id));
    }

    // uploadProduct 호출
    return uploadProduct(formData);
  });

  const onValid = async () => {
    await onSubmit();
  };

  const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      return;
    }

    const file = files[0];

    // 사용자가 이미지를 업로드했는지 확인,
    if (!file.type.includes("image/")) {
      alert("이미지 파일만 업로드해 주세요");
      return;
    }

    // 사용자가 올린 이미지의 크기를 5MB로 제한
    const limit = 1024 ** 2 * 5;

    if (file.size > limit) {
      alert("5MB 이하의 사진만 업로드 가능합니다");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/RKE42dt_Ful-0DfbKHMq4A/${id}`
      );
    }
  };

  return (
    <Suspense>
      <form className="flex flex-col gap-5 p-5" action={onValid}>
        <label
          htmlFor="photo"
          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              {errors.photo?.message ? (
                <div className="text-red-500">
                  잘못된 사진입니다 다시 추가해 주세요
                </div>
              ) : (
                <div className="text-neutral-400">사진을 추가해 주세요.</div>
              )}
            </>
          ) : null}
        </label>
        <input
          type="file"
          id="photo"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
        />
        <Input
          {...register("title")}
          required
          placeholder="제목을 입력해 주세요"
          errorMessage={[errors.title?.message ?? ""]}
        />
        <Input
          {...register("price")}
          type="number"
          required
          placeholder="가격을 입력해 주세요"
          errorMessage={[errors.price?.message ?? ""]}
        />
        <Input
          {...register("description")}
          type="text"
          required
          placeholder="상품에 대한 설명을 입력해 주세요"
          errorMessage={[errors.description?.message ?? ""]}
        />
        <Button>올리기</Button>
      </form>
    </Suspense>
  );
}
