"use client";

import { createComment } from "@/app/post/[id]/actions";
import { CommentListType } from "@/app/post/[id]/page";
import { CommentType } from "@/app/post/[id]/schema";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import Image from "next/image";
import { Suspense, useOptimistic, useState } from "react";
import { useForm } from "react-hook-form";

interface CommentListProps {
  comments: CommentListType;
  post_id: number;
  user_id: number;
}

interface CommentDataType {
  id: number;
  payload: string;
  created_at: Date;
  user: {
    username: string;
    avatar: string;
  };
}

export default function CommentList({
  comments,
  post_id,
  user_id,
}: CommentListProps) {
  const [payload, setPayload] = useState("");
  const { reset, handleSubmit, register } = useForm<CommentType>();
  const [state, reducer] = useOptimistic(
    comments,
    (prev, payload: CommentDataType) => [...prev, payload]
  );

  const onSubmit = handleSubmit(async (data) => {
    reducer({
      id: user_id,
      created_at: new Date(),
      user: {
        username: "Hello",
        avatar: "",
      },
      payload,
    });
    const formData = new FormData();
    formData.append("payload", data.payload);
    formData.append("user_id", `${user_id}`);
    formData.append("post_id", `${post_id}`);

    createComment(formData);
    reset();
  });

  return (
    <div className="mt-8 flex flex-col justify-between border-t border-neutral-400">
      <Suspense
        fallback={
          <div className="flex flex-col gap-1">
            <div className="h-5 w-40 rounded-md bg-neutral-700" />
            <div className="h-5 w-20 rounded-md bg-neutral-700" />
          </div>
        }
      >
        {state.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 border-b border-neutral-400 py-5 last:border-none"
          >
            <div className="flex items-center gap-2">
              <Image
                width={28}
                height={28}
                className="size-7 rounded-full"
                src={item.user.avatar!}
                alt={item.user.username}
              />
              <span className="text-xs">{item.user.username}</span>
              <p className="text-xs text-neutral-400">
                {formatToTimeAgo(item.created_at.toString())}
              </p>
            </div>
            <p className="ml-9">{item.payload}</p>
          </div>
        ))}
      </Suspense>
      <form className="flex gap-4" action={() => onSubmit()}>
        <textarea
          className="flex-3 w-full resize-none rounded-md bg-inherit"
          {...register("payload")}
          required
          placeholder="모두와 함께하는 공간입니다 타인을 배려하는 마음으로 댓글을 남겨주세요"
          onChange={(e) => setPayload(e.target.value)}
        />
        <button className="min-w-fit rounded-md bg-orange-500 p-5 text-white">
          댓글 작성
        </button>
      </form>
    </div>
  );
}
