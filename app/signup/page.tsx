import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">회원가입을 위해 아래 양식을 작성하세요!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <input
            className="h-10 w-full rounded-md border-none bg-transparent ring-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            type="text"
            placeholder="사용자명"
            required
          />
          <span className="font-medium text-red-500">에러 메시지</span>
        </div>
        <button className="primary-btn h-10">회원가입</button>
      </form>
      {/* 구분선 */}
      <div className="h-px w-full bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/sns"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
          </span>
          <span>SNS를 이용해 회원가입</span>
        </Link>
      </div>
    </div>
  );
}
