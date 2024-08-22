"use client";

import { createComment } from "@/app/post/[id]/actions";
import { CommentListType } from "@/app/post/[id]/page";
import { CommentType } from "@/app/post/[id]/schema";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import Image from "next/image";
import { useOptimistic, useState } from "react";
import { useForm } from "react-hook-form";

interface CommentListProps {
  comments: CommentListType;
  postId: number;
  userId: number;
}

export default function CommentList({
  comments,
  postId,
  userId,
}: CommentListProps) {
  const [payload, setPayload] = useState("");
  const { reset, handleSubmit, register } = useForm<CommentType>();
  const [state, reducer] = useOptimistic(comments, (prev) => [
    ...prev,
    {
      ...prev[prev.length - 1],
      payload,
    },
  ]);

  const onSubmit = handleSubmit(async (data) => {
    reducer(undefined);
    const formData = new FormData();
    formData.append("payload", data.payload);
    formData.append("userId", `${userId}`);
    formData.append("postId", `${postId}`);

    createComment(formData);
    reset();
  });

  return (
    <div className="mt-8 flex flex-col justify-between border-t border-neutral-400">
      <div className="h-full overflow-auto">
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
      </div>
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
