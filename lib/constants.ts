// Validation
// Email
export const EMAIL_REQUIRED_ERROR = "이메일을 입력해 주세요";
export const EMAIL_TYPE_ERROR = "이메일 형식으로 입력해 주세요";

// Password
export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);
export const PASSWORD_REQUIRED_ERROR = "비밀번호를 입력해 주세요";
export const PASSWORD_MIN_LENGTH_ERROR =
  "비밀번호는 4자리 이상으로 만들어주세요";
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다";
  export const PAGE_LIMIT = 10;