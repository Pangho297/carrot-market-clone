"use client";

import { ProfileType } from "@/app/(tabs)/profile/edit/page";
import { notFound } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Input from "./Input";
import { getUploadUrl } from "@/app/upload-product/action";
import { ProfileFormType } from "@/app/(tabs)/profile/edit/schema";
import { updateProfile } from "@/app/(tabs)/profile/edit/action";

interface EditProfileFormProps {
  initProfile: ProfileType;
}

export default function EditProfileForm({ initProfile }: EditProfileFormProps) {
  const [profile, setProfile] = useState(initProfile);
  const [preview, setPreview] = useState(initProfile.avatar);
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: profile.avatar,
      username: profile.username,
    },
  });

  const onSubmit = handleSubmit(async (data: ProfileFormType) => {
    // Cloudflare에 이미지 업로드

    if (file !== null && uploadUrl !== "") {
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

    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    formData.append("username", data.username);

    return updateProfile(formData, profile.id);
  });

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    if (!files) {
      return;
    }

    const file = files[0];

    // 사용자가 이미지를 업로드 했는지 확인
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
        "avatar",
        `https://imagedelivery.net/RKE42dt_Ful-0DfbKHMq4A/${id}`
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh_-_78px)] flex-col justify-between gap-5 p-5">
      <h1 className="flex h-20 items-center text-3xl font-bold">
        회원정보 수정
      </h1>
      <form
        className="flex h-full flex-col items-start justify-between"
        action={async () => onSubmit()}
      >
        <div className="flex w-full flex-col justify-between gap-5">
          <div className="flex w-1/2 flex-col gap-3">
            <p className="text-xl font-bold">프로필 사진</p>
            <label
              htmlFor="avatar"
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-full bg-cover bg-center text-neutral-300"
              style={{
                backgroundImage: `url(${preview?.includes("imagedelivery") ? `${preview}/public` : preview})`,
              }}
            >
              <>
                {!preview ? (
                  <UserIcon className="size-full rounded-full" />
                ) : null}
              </>
            </label>
            <input
              type="file"
              id="avatar"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xl font-bold">사용자명</p>
            <Input
              {...register("username")}
              required
              placeholder="사용자명을 입력해 주세요"
            />
          </div>
        </div>
        <Button type="submit">회원정보 수정</Button>
      </form>
    </div>
  );
}
