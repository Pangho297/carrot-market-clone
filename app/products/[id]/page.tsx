import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToWon from "@/utils/formatToWon";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

interface ParamsType {
  id: string;
}

interface ProductDetailProps {
  params: ParamsType;
}

async function getIsOwner(userId: number) {
  const session = await getSession();
  return session.id === userId;
}

/** fetch 요청의 cache 저장
 *
 * fetch 요청이 cache로 저장되는 조건은 다음과 같다
 *
 * 1. GET 요청일때
 *
 * 2. headers, cookies가 없는 경우
 *
 * 3. server actions이 아닌 경우
 */
async function TestFetch() {
  fetch("https://api.com", {
    next: {
      revalidate: 60,
      tags: ["hello"],
    },
  });
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

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

const getCachedProductTItle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: ProductDetailProps) {
  const product = await getCachedProductTItle(parseInt(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);

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

  /** revalidateTag 테스트 함수 */
  const revalidate = async () => {
    "use server";
    revalidateTag("product-title");
  };

  return (
    <div className="relative h-full">
      <div className="relative aspect-square">
        <Image
          fill
          src={`${product.photo}/public`}
          alt={product.title}
          className="object-cover"
        />
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
      <div className="absolute bottom-0 left-0 flex w-full max-w-screen-md items-center justify-between bg-neutral-800 p-5">
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
  );
}
