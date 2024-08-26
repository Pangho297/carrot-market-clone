"use client";

import { MessageType } from "@/app/chats/[id]/page";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";

interface MessageListProps {
  initialMessages: MessageType;
  userId: number;
}

export default function MessageList({
  initialMessages,
  userId,
}: MessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  /** 메세지 전송 함수 */
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    // 메세지가 보내진 것처럼 보여지게 만들기 (Fake 메세지 추가)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "",
          avatar: "",
        },
      },
    ]);

    
    setMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-2 ${userId === message.userId ? "justify-end" : ""}`}
        >
          {userId === message.userId ? null : (
            <Image
              width={50}
              height={50}
              src={message.user.avatar ?? ""}
              alt={message.user.username}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${userId === message.userId ? "items-end" : ""}`}
          >
            <span
              className={`rounded-md px-2 py-1 ${userId === message.userId ? "bg-neutral-700" : "bg-orange-500"}`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          type="text"
          name="message"
          required
          onChange={onChange}
          value={message}
          className="placeholder: h-10 w-full rounded-full border-none bg-transparent px-5 text-neutral-200 ring-2 ring-neutral-200 transition focus:outline-none focus:ring-4 focus:ring-neutral-50"
        />
        <button type="submit">
          <ArrowUpCircleIcon className="absolute right-0 top-0 size-10" />
        </button>
      </form>
    </div>
  );
}
