import db from "@/lib/db";
import formatToTimeAgo from "@/utils/formatToTimeAgo";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Link from "next/link";

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          comment_list: true,
          like_list: true,
        },
      },
    },
  });

  return posts;
}

const getCachedPosts = nextCache(getPosts, ["post-list"], {
  tags: ["post-list"],
});

export const metadata = {
  title: "동네생활",
};

export default async function Life() {
  const posts = await getCachedPosts();

  return (
    <div className="flex flex-col p-5">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="mb-5 flex flex-col gap-2 border-b border-neutral-500 pb-5 text-neutral-400 last:border-b-0 last:pb-0"
        >
          <h2 className="text-lg font-semibold text-white">{post.title}</h2>
          <p>{post.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>·</span>
              <span>조회 {post.views}</span>
            </div>
            <div className="flex items-center gap-4 *:flex *:items-center *:gap-1">
              <span>
                <HandThumbUpIcon className="size-4" />
                {post._count.like_list}
              </span>
              <span>
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comment_list}
              </span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/upload-life"
        className="fixed bottom-24 right-8 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
