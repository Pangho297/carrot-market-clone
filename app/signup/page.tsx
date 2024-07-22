"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import { useFormState } from "react-dom";

export default function Signup() {
  const [state, dispatch] = useFormState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">회원가입을 위해 아래 양식을 작성하세요!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          placeholder="사용자명을 입력해 주세요"
          name="username"
          required
        />
        <FormInput
          type="email"
          placeholder="이메일을 입력해 주세요."
          name="email"
          required
        />
        <FormInput
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          name="password"
          required
        />
        <FormInput
          type="password"
          placeholder="비밀번호를 확인해 주세요"
          name="confirm_password"
          required
        />

        <FormButton loadingText="회원가입 중입니다...">회원가입</FormButton>
      </form>
      {/* 구분선 */}
      <SocialLogin />
    </div>
  );
}
