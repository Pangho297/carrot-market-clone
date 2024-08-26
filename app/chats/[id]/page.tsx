import MessageList from "@/components/MessageList";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    // 채팅방 사용자 확인을 위한 채팅방에 소속된 사용자의 id도 함께 받음
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));

    if (!canSee) {
      return null;
    }
  }

  return room;
}

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
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

export type MessageType = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  /** 메세지는 새로 생성되거나 수정됐을 때 변경이 일어남을 알아야 하고
   *
   * 새로운 메세지가 들어왔을 때마다 메세지를 추가로 로드해줘야 한다
   *
   * 때문에 무한 스크롤과 비슷하게 구현하기 위해 처음 렌더링됐을 때의 메세지를 따로 변수로 선언한다
   */
  const initialMessages = await getMessages(params.id);
  const session = await getSession()

  if (!room) {
    return notFound();
  }

  return <MessageList userId={session.id!} initialMessages={initialMessages} />;
}
