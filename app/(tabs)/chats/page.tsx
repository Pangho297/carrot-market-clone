import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import Link from "next/link";

async function getChats(user_id: number) {
  const chats = await db.chatRoom.findMany({
    where: {
      user_list: { some: { id: user_id } },
    },
    select: {
      id: true,
      message_list: true,
      user_list: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      product: {
        select: {
          photo: true,
          title: true,
        },
      },
    },
  });

  return chats;
}

const getCachedChats = nextCache(getChats, ["chat-list"], {
  tags: ["chat-list"],
});

export default async function Chat() {
  const session = await getSession();

  const chatList = await getCachedChats(session.id!);
  return (
    <div className="flex flex-col p-5">
      {chatList.map((chat) => (
        <Link
          href={`/chats/${chat.id}`}
          key={chat.id}
          className="cursor-pointer border-b border-neutral-400 p-5 last:border-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {chat.user_list.filter((user) => user.id !== session.id)[0]
                .avatar ? (
                <Image
                  width={50}
                  height={50}
                  src={
                    chat.user_list.filter((user) => user.id !== session.id)[0]
                      .avatar ?? ""
                  }
                  alt="chat_icon"
                  className="size-14 rounded-full"
                />
              ) : (
                <UserIcon className="size-14 rounded-full text-neutral-50" />
              )}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold text-white">
                  {
                    chat.user_list.filter((user) => user.id !== session.id)[0]
                      .username
                  }
                  와 의 대화
                </h1>
                <p className="text-neutral-400">
                  {chat.message_list.at(-1)?.payload}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="text-neutral-400">
                {formatToTimeAgo(
                  chat.message_list.at(-1)?.created_at.toString() ??
                    new Date().toString()
                )}
              </div>
              <Image
                width={60}
                height={80}
                src={`${chat.product.photo}/avatar`}
                alt={chat.product.title}
                className="w-15 h-20 rounded-md object-cover"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
