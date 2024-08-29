"use client";

import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { LifeFormType, lifeSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Button";
import { postLife } from "./action";
import Textarea from "@/components/Textarea";

export default function UploadLife() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LifeFormType>({
    resolver: zodResolver(lifeSchema),
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);

    return postLife(formData);
  });

  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div className="flex h-full min-h-screen p-5">
      <form action={onValid} className="flex h-full w-full flex-col gap-4">
        <Input
          {...register("title")}
          required
          placeholder="제목을 입력해 주세요"
          errorMessage={[errors.title?.message ?? ""]}
          autoComplete="off"
        />
        <Textarea
          {...register("description")}
          height="full"
          required
          placeholder="모두와 함께하는 공간입니다 타인을 배려하는 마음으로 글을 남겨주세요"
          errorMessage={[errors.description?.message ?? ""]}
          autoComplete="off"
        />
        <Button type="submit">우리동네 공유하기</Button>
      </form>
    </div>
  );
}
