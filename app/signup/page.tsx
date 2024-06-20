import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
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
        <FormInput
          placeholder="사용자명을 입력해 주세요"
          required
          errorMessage={["사용자명은 2글자 이상 작성해 주세요"]}
        />
        <FormInput
          type="email"
          placeholder="이메일을 입력해 주세요."
          required
          errorMessage={["이메일 형식으로 입력해 주세요"]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          required
          errorMessage={["비밀번호를 입력해 주세요"]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호를 확인해 주세요"
          required
          errorMessage={["비밀번호를 확인해 주세요"]}
        />

        <FormButton disabled={false} loadingText="회원가입 중입니다...">
          회원가입
        </FormButton>
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
