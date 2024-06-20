import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          로그인을 위해 이메일과 비밀번호를 입력해주세요!
        </h2>
      </div>
      <form className="flex flex-col gap-3">
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

        <FormButton disabled={false}>로그인</FormButton>
      </form>
      {/* 구분선 */}
      <SocialLogin />
    </div>
  );
}
