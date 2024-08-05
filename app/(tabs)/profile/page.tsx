import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

/**  로그인한 유저에 대한 정보 조회 */
async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  /** 로그아웃 (Inline Server Action) */
  const logout = async () => {
    "use server";

    const session = await getSession();
    session.destroy();
    redirect("/");
  };

  return (
    <div>
      <h1>환영합니다! {user?.username}!</h1>
      {/* Server Action을 사용하기위해 form 태그로 감쌈 */}
      <form action={logout}>
        <button>로그아웃</button>
      </form>
    </div>
  );
}
