import MessageList from "@/components/MessageList";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import SoldButton from "@/components/SoldButton";
import Link from "next/link";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    // 채팅방 사용자 확인을 위한 채팅방에 소속된 사용자의 id도 함께 받음
    include: {
      user_list: {
        select: {
          id: true,
        },
      },
    },
  });

  if (room) {
    const session = await getSession();
    const canSee = Boolean(
      room.user_list.find((user) => user.id === session.id)
    );

    if (!canSee) {
      return null;
    }
  }

  return room;
}

async function getUserProfile(id: number) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      target_review_list: {
        where: {
          writer_id: id,
        },
      },
    },
  });

  return user;
}

const getCachedUserProfile = nextCache(getUserProfile, ["user-profile"], {
  tags: ["user-profile"],
});

async function getMessages(chatRoom_id: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoom_id,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      user_id: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      photo: true,
      price: true,
      user_id: true,
      is_sold: true,
    },
  });

  return product;
}

export type MessageType = Prisma.PromiseReturnType<typeof getMessages>;
export type UserType = Prisma.PromiseReturnType<typeof getUserProfile>;
export type ChatRoomProductType = Prisma.PromiseReturnType<typeof getProduct>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);

  if (!room) {
    return notFound();
  }

  /** 메세지는 새로 생성되거나 수정됐을 때 변경이 일어남을 알아야 하고
   *
   * 새로운 메세지가 들어왔을 때마다 메세지를 추가로 로드해줘야 한다
   *
   * 때문에 무한 스크롤과 비슷하게 구현하기 위해 처음 렌더링됐을 때의 메세지를 따로 변수로 선언한다
   */
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getCachedUserProfile(session.id!);
  const roomOwner = await getCachedUserProfile(
    room.user_list.filter((user) => user.id !== session.id)[0].id
  );
  const product = await getProduct(room.product_id);

  if (!user || !roomOwner) {
    return notFound();
  }

  if (!product) {
    return notFound();
  }

  const isOwner = product.user_id === session.id;

  return (
    <div className="relative min-h-full">
      <div className="sticky top-0 h-full w-full items-center gap-5 bg-neutral-800 p-5">
        <div className="mb-4 flex items-center gap-5">
          {roomOwner.avatar ? (
            <Image
              width={60}
              height={60}
              src={roomOwner.avatar}
              alt={roomOwner.username}
              className="size-16 rounded-full"
            />
          ) : (
            <UserIcon className="size-16 rounded-full" />
          )}
          <h1 className="text-2xl">{roomOwner.username}</h1>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-5">
            <Image
              width={64}
              height={80}
              src={`${product.photo}/avatar`}
              alt={product.title}
              className="h-20 w-16 rounded-md object-cover"
            />
            <div
              className={`flex flex-col justify-center *:text-xl *:font-bold ${product.is_sold ? "*:text-neutral-500 *:line-through" : ""}`}
            >
              <h1>{product.title}</h1>
              <span>{product.price.toLocaleString("ko-KR")}원</span>
            </div>
          </div>
          {isOwner ? (
            <SoldButton product={product} />
          ) : !isOwner &&
            product.is_sold &&
            roomOwner.target_review_list.length === 0 ? (
            <Link
              href={`/review?target=${roomOwner.id}`}
              className="rounded-md bg-orange-500 p-2 text-white"
            >
              리뷰 남기기
            </Link>
          ) : null}
        </div>
      </div>
      <MessageList
        channelId={params.id}
        user_id={session.id!}
        user={user}
        initialMessages={initialMessages}
      />
    </div>
  );
}
