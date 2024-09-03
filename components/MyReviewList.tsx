"use client";

import {
  getMoreTargetReviews,
  getMoreWriteReviews,
} from "@/app/(tabs)/profile/[[...id]]/actions";
import {
  InitialTargetReviews,
  InitialWriteReviews,
} from "@/app/(tabs)/profile/[[...id]]/page";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Review {
  target_id?: number;
  writer_id?: number;
  writer?: {
    username: string;
    avatar: string | null;
  };
  target?: {
    username: string;
    avatar: string | null;
  };
  payload: string;
}

interface MyReviewListProps {
  initialReviews: InitialTargetReviews | InitialWriteReviews;
  id: number;
  isTarget: boolean;
}

export default function MyReviewList({
  initialReviews,
  id,
  isTarget,
}: MyReviewListProps) {
  const [reviewList, setReviewList] = useState(initialReviews);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  const isTargetReview = (
    review: Review
  ): review is Review & { target_id: number } => {
    return "target_id" in review;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries, observer) => {
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          const newReviews = isTarget
            ? await getMoreTargetReviews(page, id)
            : await getMoreWriteReviews(page, id);

          if (newReviews.reviews.length !== 0) {
            setPage((prev) => prev + 1);
            // @ts-ignore 타입에 안맞게 들어갈일이 없는것으로 판단하여 사용
            setReviewList((prev) => ({
              reviews: [...prev.reviews, ...newReviews.reviews],
              totalCount: prev.totalCount,
            }));
          } else {
            setIsLastPage(true);
          }
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, id]);

  const renderReview = (review: Review) => {
    const key = isTargetReview(review) ? review.target_id : review.writer_id;
    console.log(review);
    return (
      <div key={key}>
        <div className="flex h-52 w-52 flex-col gap-2 rounded-md border border-neutral-600 p-4">
          {isTargetReview(review) ? (
            // 사용자에게 리뷰를 작성한 사람
            <div className="flex h-full flex-col justify-between">
              <p>{review.payload}</p>
              <div className="flex items-center justify-end gap-2">
                <div className="text-xs text-neutral-400">작성자</div>
                <div className="text-xs text-neutral-400">
                  {review.writer?.username}
                </div>
                {review.writer?.avatar ? (
                  <Image
                    width={40}
                    height={40}
                    src={review.writer?.avatar ?? ""}
                    alt={review.writer?.username ?? ""}
                    className="size-5"
                  />
                ) : (
                  <UserIcon className="size-5" />
                )}
              </div>
            </div>
          ) : (
            // 리뷰를 작성한사람의 대상
            <div className="flex h-full flex-col justify-between">
              <p>{review.payload}</p>
              <div className="flex items-center justify-end gap-2">
                <div className="text-xs text-neutral-400">대상</div>
                <div className="text-xs text-neutral-400">
                  {review.target?.username}
                </div>
                {review.target?.avatar ? (
                  <Image
                    width={40}
                    height={40}
                    src={review.target?.avatar ?? ""}
                    alt={review.target?.username ?? ""}
                    className="size-5"
                  />
                ) : (
                  <UserIcon className="size-5" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <h3 className="text-2xl font-bold">
        {isTarget ? "내가 받은 리뷰" : "내가 작성한 리뷰"} (
        {reviewList.totalCount})
      </h3>
      <div className="scrollbar-hide flex max-w-screen-md gap-5 overflow-auto">
        {reviewList.reviews.map(renderReview)}
        {!isLastPage && <span ref={trigger} />}
      </div>
    </div>
  );
}
