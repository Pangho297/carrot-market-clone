"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

interface createMessageProps {
  payload: string;
  userId: number;
  chatRoomId: string;
}

export async function createMessage(data: createMessageProps) {
  const { payload, userId, chatRoomId } = data;
  const message = await db.message.create({
    data: {
      payload,
      userId,
      chatRoomId,
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
