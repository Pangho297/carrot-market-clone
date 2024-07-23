"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { login } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          로그인을 위해 이메일과 비밀번호를 입력해주세요!
        </h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input
          type="email"
          name="email"
          placeholder="이메일을 입력해 주세요."
          required
          errorMessage={state?.fieldErrors.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해 주세요"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errorMessage={state?.fieldErrors.password}
        />

        <Button>로그인</Button>
      </form>
      {/* 구분선 */}
      <SocialLogin />
    </div>
  );
}
