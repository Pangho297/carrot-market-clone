"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic } from "react";
import { dislikePost, likePost } from "@/app/post/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  postId,
}: LikeButtonProps) {
  const [state, reducer] = useOptimistic({ isLiked, likeCount }, (prev) => ({
    isLiked: !prev.isLiked,
    likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
  }));

  const onClick = async () => {
    reducer(undefined);

    if (isLiked) {
      await dislikePost(postId);
    } else {
      await likePost(postId);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 ${state.isLiked ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-500" : "hover:bg-neutral-800"}`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      <span>좋아요 {state.likeCount}</span>
    </button>
  );
}
