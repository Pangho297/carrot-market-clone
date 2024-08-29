"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

interface createMessageProps {
  payload: string;
  user_id: number;
  chatRoom_id: string;
}

export async function createMessage(data: createMessageProps) {
  const { payload, user_id, chatRoom_id } = data;
  const message = await db.message.create({
    data: {
      payload,
      user_id,
      chatRoom_id,
    },
    select: {
      id: true,
    },
  });

  if (!Boolean(message)) {
    alert("메세지 전송에 실패했습니다");
  }

  revalidateTag("user-profile");
  revalidateTag("chat-list");

  return message;
}
