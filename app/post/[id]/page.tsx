import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import {
  revalidatePath,
  unstable_cache as nextCache,
  revalidateTag,
} from "next/cache";
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
          },
        },
      },
    });

    return post;
  } catch (error) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail-1"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    // 게시글에 좋아요를 누른지에 대한값을 얻기위한 db 접근
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    // like개수만 받기위한 db 접근
    where: {
      postId,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

/** tags에 변수를 넣어 캐시 데이터를 저장하는 방법 */
function getCachedLikeStatus(postId: number, userId: number) {
  const cached = nextCache( // 변수명은 상관없음
    (postId, userId) => getLikeStatus(postId, userId),
    ["post-like-status"],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cached(postId, userId);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  const session = await getSession();

  if (isNaN(id)) {
    return notFound();
  }

  const post = await getCachedPost(id);
  const { isLiked, likeCount } = await getCachedLikeStatus(id, session.id!);

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

      // 캐싱된 데이터들을 Tag로 관리할 때 사용할 수 있는 캐시 초기화
      revalidateTag(`like-status-${id}`);
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

      revalidateTag(`like-status-${id}`);
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
          <button
            className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 ${isLiked ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-500" : "hover:bg-neutral-800"}`}
          >
            {isLiked ? (
              <HandThumbUpIcon className="size-5" />
            ) : (
              <OutlineHandThumbUpIcon className="size-5" />
            )}
            {isLiked ? (
              <span>좋아요 {likeCount}</span>
            ) : (
              <span>좋아요 {likeCount}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
