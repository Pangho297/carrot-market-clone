import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      // 게시글 조회 시 조회수를 올리기 위한 update
      where: {
        id,
      },
      data: {
        // update를 사용하기위해 필수적으로 들어가야 하는 부분, 변경할 데이터에 대해 설명한다
        views: {
          increment: 1, // views의 값을 모르지만 prisma에서 제공하는 increment를 사용해 상승할 값을 입력할 수 있다
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Comments: true,
            Likes: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    return null;
  }
}

async function getIsLiked(postId: number) {
  const session = await getSession();
  const like = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id!,
      },
    },
  });

  return Boolean(like);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getPost(id);
  const isLiked = await getIsLiked(id);

  if (!post) {
    return notFound();
  }

  /** 좋아요 추가 */
  const likePost = async () => {
    "use server";

    try {
      const session = await getSession();

      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });

      // 좋아요를 눌렀을 때 화면 갱신을 위한 캐시 초기화 (Bad Case)
      // revalidatePath(`/posts/${id}`);
    } catch (error) {}
  };

  /** 좋아요 삭제 */
  const dislikePost = async () => {
    "use server";

    try {
      const session = await getSession();

      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });

      // 좋아요를 눌렀을 때 화면 갱신을 위한 캐시 초기화 (Bad Case)
      // revalidatePath(`/posts/${id}`);
    } catch (error) {}
  };

  return (
    <div className="p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="mb-2 text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislikePost : likePost}>
          <button className="flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400">
            <HandThumbUpIcon className="size-5" />
            <span>좋아요 {post._count.Likes}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
