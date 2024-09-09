"use client";

import { createMessage } from "@/app/chats/[id]/actions";
import { MessageType, UserType } from "@/app/chats/[id]/page";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

interface MessageListProps {
  initialMessages: MessageType;
  user_id: number;
  channelId: string;
  user: UserType;
}

export default function MessageList({
  initialMessages,
  user_id,
  channelId,
  user,
}: MessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  /** 메세지 전송 함수 */
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // 메세지가 보내진 것처럼 보여지게 만들기 (Fake 메세지 추가)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        user_id,
        user: {
          username: "",
          avatar: "",
        },
      },
    ]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        user_id,
        user,
      },
    });

    await createMessage({
      payload: message,
      user_id,
      chatRoom_id: channelId,
    });

    setMessage("");
  };

  useEffect(() => {
    window.scrollTo(0, window.innerHeight);
    // Supabase client 생성
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!
    );

    // 채널 생성
    channel.current = client.channel(`channel-${channelId}`);

    // 채팅 채널 구독
    channel.current
      .on("broadcast", { event: "message" }, async (message) => {
        setMessages((prev) => [...prev, message.payload]); // 임시 메세지 표시
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [channelId]);

  return (
    <div className="h-full p-5 pb-20">
      <div className="flex flex-col justify-end gap-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${user_id === message.user_id ? "justify-end" : ""}`}
          >
            {user_id === message.user_id ? null : (
              <>
                {message.user.avatar ? (
                  <Image
                    width={50}
                    height={50}
                    src={
                      message.user.avatar
                        ? message.user.avatar.includes("imagedelivery")
                          ? `${message.user.avatar}/public`
                          : message.user.avatar
                        : ""
                    }
                    alt={message.user.username}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="size-8 rounded-full" />
                )}
              </>
            )}
            <div
              className={`flex max-w-[75%] flex-col gap-1 ${user_id === message.user_id ? "items-end" : ""}`}
            >
              <span
                className={`rounded-md px-2 py-1 ${user_id === message.user_id ? "bg-orange-500" : "bg-neutral-700"}`}
              >
                {message.payload}
              </span>
              <span className="text-xs">
                {formatToTimeAgo(message.created_at.toString())}
              </span>
            </div>
          </div>
        ))}
      </div>
      <form
        className="fixed bottom-0 left-0 flex w-full max-w-screen-md bg-neutral-900 p-5"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="message"
          required
          onChange={onChange}
          value={message}
          autoComplete="off"
          className="placeholder: h-10 w-full rounded-full border-none bg-transparent px-5 text-neutral-200 ring-2 ring-neutral-200 transition focus:outline-none focus:ring-4 focus:ring-neutral-50"
        />
        <button type="submit">
          <ArrowUpCircleIcon className="absolute right-5 top-5 size-10" />
        </button>
      </form>
    </div>
  );
}
