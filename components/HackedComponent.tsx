"use client";

import { fetchFormAPI } from "@/app/extras/actions";

/** 클라이언트 컴포넌트로의 데이터 누출 방지 학습용 컴포넌트  */
export default function HackedComponent({}: any) {
  fetchFormAPI()
  return <h1>해킹!</h1>
}