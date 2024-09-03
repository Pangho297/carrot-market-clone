import MyProductList from "@/components/MyProductList";
import { PAGE_LIMIT } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

    session.destroy();
    redirect("/");
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between border-b border-neutral-400 p-5">
        <div className="flex items-center gap-5">
          {user.avatar ? (
            <Image
              width={50}
              height={50}
              src={user.avatar ?? ""}
              alt="chat_icon"
              className="size-14 rounded-full"
            />
          ) : (
            <UserIcon className="size-14 rounded-full text-neutral-50" />
          )}
          <h1>{user?.username}님 환영합니다!</h1>
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
      <MyProductList
        initialProducts={initialSaleProducts}
        id={params.id ? id : me!}
        isSold={false}
      />
      <MyProductList
        initialProducts={initialSoldProducts}
        id={params.id ? id : me!}
        isSold={true}
      />
    </div>
  );
}
