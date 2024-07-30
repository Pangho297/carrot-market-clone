import crypto from "crypto";
import { NextRequest } from "next/server";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET() {
  // CSRF 공격을 대비한 state 구성 및 세션 저장
  const state = crypto.randomBytes(32).toString("hex");
  const session = await getSession();
  session.state = state;
  session.save();

  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL!,
    response_type: "code",
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    include_granted_scopes: "true",
    state,
  };

  const formattedParams = new URLSearchParams(params).toString();
  const fullUrl = `${baseUrl}?${formattedParams}`;

  return redirect(fullUrl);
}
