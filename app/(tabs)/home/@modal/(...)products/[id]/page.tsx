import CloseModalBtn from "@/components/CloseModalBtn";
import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToWon from "@/utils/formatToWon";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(user_id: number) {
  const session = await getSession();
  return session.id === user_id;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      // user에서 가져올 데이터 선택, 안하면 유저와 관련된 모든 데이터를 가져오기 때문
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.user_id);

  const deleteProduct = async () => {
    "use server";

    const deletedProduct = await db.product.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (Boolean(deletedProduct)) {
      return redirect("/home");
    }
  };

  const createChatRoom = async () => {
    "use server";

    const session = await getSession();

    const existingRoom = await db.chatRoom.findFirst({
      where: {
        product_id: product.id,
        user_list: {
          some: {
            id: session.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (existingRoom) {
      revalidateTag("chat-list");
      return redirect(`/chats/${existingRoom.id}`);
    }

    const room = await db.chatRoom.create({
      data: {
        product_id: product.id,
        user_list: {
          connect: [
            // 업로드 한 사용자
            {
              id: product.user_id,
            },
            // 구매자
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });

    if (!Boolean(room)) {
      return notFound();
    }
    revalidateTag("chat-list");
    return redirect(`/chats/${room.id}`);
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
      <CloseModalBtn />
      <div className="flex h-full w-full max-w-screen-sm items-end justify-center">
        <div className="relative flex h-5/6 w-full flex-col rounded-t-2xl bg-neutral-900">
          <div className="relative flex items-center justify-center overflow-hidden rounded-md">
            {product.photo ? (
              <Image
                width={640}
                height={640}
                src={`${product.photo}/public`}
                alt={product.title}
                className="h-[640px] w-[640px] object-cover"
              />
            ) : (
              <PhotoIcon className="h-28" />
            )}
            {product.is_sold && (
              <div className="absolute left-0 top-0 size-full">
                <div className="relative size-full">
                  <div className="size-full bg-neutral-400 opacity-50" />
                  <div className="absolute bottom-5 left-5 flex size-40 items-center justify-center rounded-full ring-8 ring-white">
                    <h1 className="text-4xl font-bold">판매완료</h1>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="border-b border-neutral-700 p-5">
            <Link
              href={`/profile/${product.user_id}`}
              className="flex w-fit items-center gap-3 text-white"
            >
              <div className="size-10 overflow-hidden rounded-full">
                {product.user.avatar !== null ? (
                  <Image
                    width={40}
                    height={40}
                    src={
                      product.user.avatar
                        ? product.user.avatar.includes("imagedelivery")
                          ? `${product.user.avatar}/public`
                          : product.user.avatar
                        : ""
                    }
                    alt={product.user.username}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div>
                <h3>{product.user.username}</h3>
              </div>
            </Link>
          </div>
          <div className="p-5">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p>{product.description}</p>
          </div>
          <div className="absolute bottom-0 left-0 flex w-full max-w-screen-sm items-center justify-between bg-neutral-800 p-5">
            <span className="text-xl font-semibold">
              {formatToWon(product.price)} 원
            </span>
            {isOwner ? (
              <div className="flex gap-4">
                <form action={deleteProduct}>
                  <button className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white">
                    삭제하기
                  </button>
                </form>
                {!product.is_sold && (
                  <Link
                    href={`/upload-product?id=${product.id}`}
                    className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white"
                  >
                    수정하기
                  </Link>
                )}
              </div>
            ) : null}
            {isOwner || product.is_sold ? null : (
              <form action={createChatRoom}>
                <button className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white">
                  채팅
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
