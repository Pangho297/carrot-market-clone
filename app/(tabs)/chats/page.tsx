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
      created_at: true,
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
          is_sold: true,
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
      {chatList
        .filter((chat) => chat.message_list.length > 0)
        .sort(
          (a, b) =>
            b.message_list.at(-1)!.created_at.valueOf() -
            a.message_list.at(-1)!.created_at.valueOf()
        ) // 메세지 최신 순으로 정렬
        .map((chat) => (
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
                  </h1>
                  <p className="text-neutral-400">
                    {chat.message_list.at(-1)?.payload}
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex flex-col items-end gap-2">
                  {chat.product.is_sold ? (
                    <p className="rounded-md bg-neutral-600 p-1 text-xs text-white">
                      판매 완료
                    </p>
                  ) : null}
                  <div className="text-xs text-neutral-400">
                    {formatToTimeAgo(
                      chat.message_list.at(-1)?.created_at.toString() ??
                        new Date().toString()
                    )}
                  </div>
                </div>
                <Image
                  width={64}
                  height={80}
                  src={`${chat.product.photo}/avatar`}
                  alt={chat.product.title}
                  className="h-20 w-16 rounded-md object-cover"
                />
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}
