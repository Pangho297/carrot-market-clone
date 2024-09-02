"use server";

import db from "@/lib/db";
import { reviewSchema } from "./schema";
import { redirect } from "next/navigation";

type CreateReviewDataType = {
  writerId: number;
  targetId: number;
  payload: string;
};

export async function createReview(data: CreateReviewDataType) {
  const result = reviewSchema.safeParse(data);

  try {
    if (!result.success) {
      return result.error.flatten();
    } else {
      await db.review.create({
        data: {
          writer_id: data.writerId,
          target_id: data.targetId,
          payload: data.payload,
        },
        select: {
          writer_id: true,
        },
      });

      console.log(result);
    }
  } catch (error) {
  } finally {
    return redirect("/");
  }
}
