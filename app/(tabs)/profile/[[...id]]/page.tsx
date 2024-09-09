import MyProductList from "@/components/MyProductList";
import MyReviewList from "@/components/MyReviewList";
import { PAGE_LIMIT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getInitialSaleProductList(id: number) {
  if (id) {
    const totalCount = await db.product.findMany({
      where: {
        user_id: id,
        is_sold: false,
      },
      select: {
        id: true,
      },
    });
    const products = await db.product.findMany({
      where: {
        user_id: id,
        is_sold: false,
      },
      select: {
        title: true,
        price: true,
        created_at: true,
        photo: true,
        id: true,
      },
      take: PAGE_LIMIT,
      orderBy: {
        created_at: "desc",
      },
    });

    if (products) {
      return { products, totalCount: totalCount.length };
    }
  }

  notFound();
}

const getCachedInitialSaleProductList = nextCache(
  getInitialSaleProductList,
  ["sale-product-list"],
  {
    tags: ["product-list"],
  }
);

async function getInitialSoldProductList(id: number) {
  if (id) {
    const totalCount = await db.product.findMany({
      where: {
        user_id: id,
        is_sold: true,
      },
      select: {
        id: true,
      },
    });
    const products = await db.product.findMany({
      where: {
        user_id: id,
        is_sold: true,
      },
      select: {
        title: true,
        price: true,
        created_at: true,
        photo: true,
        id: true,
      },
      take: PAGE_LIMIT,
      orderBy: {
        created_at: "desc",
      },
    });

    if (products) {
      return { products, totalCount: totalCount.length };
    }
  }

  notFound();
}

const getCachedInitialSoldProductList = nextCache(
  getInitialSoldProductList,
  ["sold-product-list"],
  {
    tags: ["product-list"],
  }
);

export type InitialSaleProducts = Prisma.PromiseReturnType<
  typeof getInitialSaleProductList
>;

async function getInitialTargetReviewList(id: number) {
  const totalCount = await db.review.findMany({
    where: {
      target_id: id,
    },
    select: {
      target_id: true,
    },
  });
  const reviews = await db.review.findMany({
    where: {
      target_id: id,
    },
    select: {
      target_id: true,
      writer: {
        select: {
          username: true,
          avatar: true,
        },
      },
      payload: true,
    },
    take: PAGE_LIMIT,
    orderBy: {
      created_at: "desc",
    },
  });

  if (reviews) {
    return { reviews, totalCount: totalCount.length };
  }

  notFound();
}

const getCachedInitialTargetReviewList = nextCache(
  getInitialTargetReviewList,
  ["target-review-list"],
  {
    tags: ["review-list"],
  }
);

async function getInitialWriteReviewList(id: number) {
  const totalCount = await db.review.findMany({
    where: {
      writer_id: id,
    },
    select: {
      writer_id: true,
    },
  });
  const reviews = await db.review.findMany({
    where: {
      writer_id: id,
    },
    select: {
      writer_id: true,
      target: {
        select: {
          username: true,
          avatar: true,
        },
      },
      payload: true,
    },
    take: PAGE_LIMIT,
    orderBy: {
      created_at: "desc",
    },
  });

  if (reviews) {
    return { reviews, totalCount: totalCount.length };
  }

  notFound();
}

const getCachedInitialWriteReviewList = nextCache(
  getInitialWriteReviewList,
  ["target-review-list"],
  {
    tags: ["review-list"],
  }
);

export type InitialTargetReviews = Prisma.PromiseReturnType<
  typeof getInitialTargetReviewList
>;

export type InitialWriteReviews = Prisma.PromiseReturnType<
  typeof getInitialWriteReviewList
>;

/**  로그인한 유저에 대한 정보 조회 */
async function getUser(id: number) {
  if (id) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile({ params }: { params: { id: string } }) {
  const session = await getSession();
  const me = session.id;
  const id = parseInt(params.id);
  let user;

  const initialSaleProducts = await getCachedInitialSaleProductList(
    params.id ? id : me!
  );
  const initialSoldProducts = await getCachedInitialSoldProductList(
    params.id ? id : me!
  );

  const initialTargetReviews = await getCachedInitialTargetReviewList(
    params.id ? id : me!
  );
  const initialWriteReviews = await getCachedInitialWriteReviewList(
    params.id ? id : me!
  );

  if (!id) {
    user = await getUser(me!);
  } else {
    if (id === me) {
      return redirect("/profile");
    }
    user = await getUser(id);
  }

  /** 로그아웃 (Inline Server Action) */
  const logout = async () => {
    "use server";

    // 클라이언트 에서 넘겨줄 수 없어서 이곳에서 session을 새로 할당하여 사용
    const session = await getSession();

    session.destroy();
    redirect("/");
  };

  return (
    <div className="relative flex flex-col">
      <div className="sticky top-0 flex justify-between border-b border-neutral-400 bg-neutral-900 p-5">
        <div className="flex items-center gap-5">
          {user.avatar ? (
            <Image
              width={50}
              height={50}
              src={
                user.avatar
                  ? user.avatar.includes("imagedelivery")
                    ? `${user.avatar}/public`
                    : user.avatar
                  : ""
              }
              alt="chat_icon"
              className="size-14 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="size-14 rounded-full text-neutral-50" />
          )}
          <h1 className="text-2xl font-bold">
            {user?.username}
            {!id || me === id ? "님 환영합니다!" : ""}
          </h1>
        </div>
        {!params.id ? (
          <div className="flex items-center gap-5">
            <Link
              href="/profile/edit"
              className="rounded-md bg-orange-500 p-2 text-white"
            >
              회원정보 수정
            </Link>
            {/* Server Action을 사용하기위해 form 태그로 감쌈 */}
            <form action={logout}>
              <button className="rounded-md bg-neutral-600 p-2 text-white">
                로그아웃
              </button>
            </form>
          </div>
        ) : null}
      </div>
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="flex h-[316px] w-52 flex-col justify-start gap-2">
              <div className="h-[258px] rounded-md bg-neutral-700" />
              <div className="h-7 w-full rounded-md bg-neutral-700" />
              <div className="h-6 w-1/2 rounded-md bg-neutral-700" />
            </div>
          </div>
        }
      >
        {/* 판매 중인 물품 */}
        <MyProductList
          initialProducts={initialSaleProducts}
          id={params.id ? id : me!}
          isSold={false}
        />
      </Suspense>
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="flex h-[316px] w-52 flex-col justify-start gap-2">
              <div className="h-[258px] rounded-md bg-neutral-700" />
              <div className="h-7 w-full rounded-md bg-neutral-700" />
              <div className="h-6 w-1/2 rounded-md bg-neutral-700" />
            </div>
          </div>
        }
      >
        {/* 판매된 물품 */}
        <MyProductList
          initialProducts={initialSoldProducts}
          id={params.id ? id : me!}
          isSold={true}
        />
      </Suspense>
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="size-52 rounded-md bg-neutral-700" />
          </div>
        }
      >
        {/* 작성한 리뷰 목록 */}
        <MyReviewList
          initialReviews={initialWriteReviews}
          id={params.id ? id : me!}
          isTarget={false}
        />
      </Suspense>
      <Suspense
        fallback={
          <div className="animate-pulse">
            <div className="size-52 rounded-md bg-neutral-700" />
          </div>
        }
      >
        {/* 받은 리뷰 목록 */}
        <MyReviewList
          initialReviews={initialTargetReviews}
          id={params.id ? id : me!}
          isTarget={true}
        />
      </Suspense>
    </div>
  );
}
