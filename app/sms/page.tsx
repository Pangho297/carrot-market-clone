import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">휴대전화번호를 인증해주세요</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          type="number"
          placeholder="휴대전화번호를 입력해 주세요"
          required
          errorMessage={["이메일 형식으로 입력해 주세요"]}
        />
        <FormInput
          type="number"
          placeholder="인증번호를 입력해 주세요"
          required
          errorMessage={["비밀번호를 입력해 주세요"]}
        />

        <FormButton disabled={false}>인증</FormButton>
      </form>
    </div>
  );
}
