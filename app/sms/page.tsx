"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { smsLogin } from "./action";

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, null);

  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">휴대전화번호를 인증해주세요</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input
          type="text"
          name="phone"
          placeholder="휴대전화번호를 입력해 주세요"
          required
          errorMessage={[]}
        />
        <Input
          type="number"
          name="token"
          placeholder="인증번호를 입력해 주세요"
          required
          min={100000}
          max={999999}
          errorMessage={[]}
        />

        <Button>인증</Button>
      </form>
    </div>
  );
}
