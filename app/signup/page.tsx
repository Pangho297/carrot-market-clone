"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import { useFormState } from "react-dom";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Signup() {
  const [state, dispatch] = useFormState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">회원가입을 위해 아래 양식을 작성하세요!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          placeholder="사용자명을 입력해 주세요"
          name="username"
          required
          errorMessage={state?.fieldErrors.username}
        />
        <Input
          type="email"
          placeholder="이메일을 입력해 주세요."
          name="email"
          required
          errorMessage={state?.fieldErrors.email}
        />
        <Input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          name="password"
          required
          errorMessage={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          type="password"
          placeholder="비밀번호를 확인해 주세요"
          name="confirm_password"
          required
          errorMessage={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
        />

        <Button loadingText="회원가입 중입니다...">회원가입</Button>
      </form>
      {/* 구분선 */}
      <SocialLogin />
    </div>
  );
}
