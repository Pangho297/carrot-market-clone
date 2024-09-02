"use client";

import { useForm } from "react-hook-form";
import Button from "./Button";
import Textarea from "./Textarea";
import {
  ReviewFormType,
  reviewSchema,
} from "@/app/chats/@modal/(..)review/schema";
import { useEffect, useState } from "react";
import { createReview } from "@/app/chats/@modal/(..)review/action";
import { zodResolver } from "@hookform/resolvers/zod";

interface ReviewFormProps {
  writerId: number;
  targetId: number;
}

export default function ReviewForm({ writerId, targetId }: ReviewFormProps) {
  const [length, setLength] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormType>({
    mode: "onChange",
    resolver: zodResolver(reviewSchema),
  });

  const onValid = async () => {
    await onSubmit();
  };

  const onSubmit = handleSubmit((data) => {
    return createReview(data);
  });

  useEffect(() => {
    setValue("targetId", targetId);
    setValue("writerId", writerId);
  }, [setValue, targetId, writerId]);

  useEffect(() => {
    setLength(watch().payload.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch().payload]);

  // console.log(watch());

  return (
    <form className="flex flex-col gap-4" action={onValid}>
      <Textarea
        {...register("payload")}
        errorMessage={[errors.payload?.message ?? ""]}
        maxLength={200}
        showLength
        length={length}
      />
      <Button type="submit">리뷰 남기기</Button>
    </form>
  );
}
