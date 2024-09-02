import CloseModalBtn from "@/components/CloseModalBtn";
import ReviewForm from "@/components/ReviewForm";
import getSession from "@/lib/session";
import { NextRequest } from "next/server";

export default async function Review({
  params,
  searchParams,
}: {
  params: any;
  searchParams: { target: string };
}) {
  const session = await getSession();

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
      <CloseModalBtn />
      <div className="flex flex-col gap-4 rounded-md bg-neutral-800 p-4">
        <h1>판매자에대한 리뷰를 남겨주세요!</h1>
        <ReviewForm
          writerId={session.id!}
          targetId={parseInt(searchParams.target)}
        />
      </div>
    </div>
  );
}
