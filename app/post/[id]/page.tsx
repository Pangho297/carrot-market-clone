import CommentList from "@/components/CommentList";
import LikeButton from "@/components/LikeButton";
import db from "@/lib/db";
import getSession from "@/lib/session";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";
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
            comment_list: true,
          },
        },
      },
    });

    return post;
  } catch (error) {
    return null;
  }
}
function getCachedPost(post_id: number) {
  const cached = nextCache(getPost, ["post-detail"], {
    tags: [`post-detail-${post_id}`],
    revalidate: 60,
  });

  return cached(post_id);
}

async function getLikeStatus(post_id: number, user_id: number) {
  const isLiked = await db.like.findUnique({
    // 게시글에 좋아요를 누른지에 대한값을 얻기위한 db 접근
    where: {
      id: {
        post_id,
        user_id,
      },
    },
  });
  const likeCount = await db.like.count({
    // like개수만 받기위한 db 접근
    where: {
      post_id,
    },
  });

  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

/** tags에 변수를 넣어 캐시 데이터를 저장하는 방법 */
function getCachedLikeStatus(post_id: number, user_id: number) {
  const cached = nextCache(
    // 변수명은 상관없음
    (post_id, user_id) => getLikeStatus(post_id, user_id),
    ["post-like-status"],
    {
      tags: [`like-status-${post_id}`],
    }
  );
  return cached(post_id, user_id);
}

async function getCommentList(post_id: number) {
  const comments = await db.comment.findMany({
    where: {
      post_id,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return comments;
}

function getCachedCommentList(post_id: number) {
  const cached = nextCache(getCommentList, ["post-comment-list"], {
    tags: [`post-comment-list-${post_id}`],
  });

  return cached(post_id);
}

export type CommentListType = Prisma.PromiseReturnType<typeof getCommentList>;

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
  const comments = await getCachedCommentList(id);

  if (!post) {
    return notFound();
  }

  return (
    <div className="flex flex-col p-5 text-white">
      <div className="mb-2 flex items-center gap-2">
        {post.user.avatar ? (
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar}
            alt={post.user.username}
          />
        ) : (
          <UserIcon className="size-7 rounded-full" />
        )}
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
        <LikeButton isLiked={isLiked} likeCount={likeCount} post_id={id} />
      </div>
      <CommentList comments={comments} post_id={id} user_id={session.id!} />
    </div>
  );
}
