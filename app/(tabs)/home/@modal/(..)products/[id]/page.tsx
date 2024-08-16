import { getIsOwner, getProduct } from "@/app/products/[id]/page";
import CloseModalBtn from "@/components/CloseModalBtn";
import db from "@/lib/db";
import formatToWon from "@/utils/formatToWon";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

new Promise((resolve) => setTimeout(resolve, 10000));

export default async function Modal({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

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

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
      <CloseModalBtn />
      <div className="flex h-full w-full max-w-screen-sm items-end justify-center">
        <div className="relative flex h-5/6 w-full flex-col rounded-t-2xl bg-neutral-900">
          <div className="flex h-[640px] w-[640px] items-center justify-center overflow-hidden rounded-md bg-neutral-700 text-neutral-200">
            {product.photo ? (
              <Image
                width={640}
                height={640}
                src={`${product.photo}/public`}
                alt={product.title}
                className="object-cover"
              />
            ) : (
              <PhotoIcon className="h-28" />
            )}
          </div>
          <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
            <div className="size-10 overflow-hidden rounded-full">
              {product.user.avatar !== null ? (
                <Image
                  width={40}
                  height={40}
                  src={product.user.avatar}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <div>
              <h3>{product.user.username}</h3>
            </div>
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
              <form action={deleteProduct}>
                <button className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white">
                  삭제하기
                </button>
              </form>
            ) : null}
            <Link
              href=""
              className="rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white"
            >
              채팅
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
