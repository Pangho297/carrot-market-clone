import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "true",
  };

  // 이곳에서 Analysis, Cookie 설정등이 이뤄질 수도 있다

  const formattedParams = new URLSearchParams(params).toString();
  const fullUrl = `${baseURL}?${formattedParams}`;

  return redirect(fullUrl);
}
