"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useState } from "react";
import { useFormState } from "react-dom";
import { getUploadUrl, uploadProduct } from "./action";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const ActionInterceptor = async (_: any, formData: FormData) => {
    // Cloudflare에 이미지 업로드

    const file = formData.get("photo");
    // 파일 업로드 안된경우 방지
    if (!file) {
      return;
    }

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm
    })

    if (res.status !== 200) {
      return alert("이미지 업로드에 실패했습니다 다시 시도해주세요")
    }
    // formData의 "photo"값 변경

    const photoUrl = `https://imagedelivery.net/RKE42dt_Ful-0DfbKHMq4A/${imageId}`
    formData.set("photo", photoUrl);
    
    // uploadProduct 호출

    return uploadProduct(_, formData)
  }
  const [state, dispatch] = useFormState(ActionInterceptor, null);

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
    const {success, result} = await getUploadUrl();
    if (success) {
      const {id, uploadURL} = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-5 p-5" action={dispatch}>
        <label
          htmlFor="photo"
          className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              {state?.fieldErrors.photo ? (
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
          name="photo"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
        />
        <Input
          type="text"
          name="title"
          required
          placeholder="제목을 입력해 주세요"
          errorMessage={state?.fieldErrors.title}
        />
        <Input
          type="number"
          name="price"
          required
          placeholder="가격을 입력해 주세요"
          errorMessage={state?.fieldErrors.price}
        />
        <Input
          type="text"
          name="description"
          required
          placeholder="상품에 대한 설명을 입력해 주세요"
          errorMessage={state?.fieldErrors.description}
        />
        <Button>올리기</Button>
      </form>
    </div>
  );
}
