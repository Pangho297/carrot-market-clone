import { revalidatePath } from "next/cache";

async function getData() {
  const data = await fetch(
    "https://nomad-movies.nomadcoders.workers.dev/movies"
  );
}

export default async function Extras() {
  await getData();
  const action = async () => {
    "use server";
    revalidatePath("/extras");
  };
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-metallica text-6xl">Extras!</h1>
      <h2 className="font-roboto">Next.js의 추가 기능들</h2>
      <form action={action}>
        <button>캐시 메모리 초기화</button>
      </form>
    </div>
  );
}
