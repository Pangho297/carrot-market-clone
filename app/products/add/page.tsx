"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useState } from "react";
import { useFormState } from "react-dom";
import { uploadProduct } from "./action";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [state, dispatch] = useFormState(uploadProduct, null);

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
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
              <div className="text-neutral-400">사진을 추가해 주세요.</div>
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
        />
        <Input
          type="number"
          name="price"
          required
          placeholder="가격을 입력해 주세요"
        />
        <Input
          type="text"
          name="description"
          required
          placeholder="상품에 대한 설명을 입력해 주세요"
        />
        <Button>올리기</Button>
      </form>
    </div>
  );
}
