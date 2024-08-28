import HackedComponent from "@/components/HackedComponent";
import { experimental_taintObjectReference } from "react";

function getData() {
  const secret = {
    apiKey: "12345678",
    secret: "01010110",
  };
  experimental_taintObjectReference("API Keys 가 유출되었습니다!!!!", secret);
  return secret;
}

export default async function Extras() {
  const data = getData();
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-metallica text-6xl">Extras!</h1>
      <h2 className="font-roboto">Next.js의 추가 기능들</h2>
      <HackedComponent data={data} />
    </div>
  );
}
