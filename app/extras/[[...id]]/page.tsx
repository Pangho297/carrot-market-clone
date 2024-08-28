export default function Extras({ params }: { params: { id: string[] } }) {
  console.log(params);
  return (
    <div className="flex flex-col gap-3 py-10">
      <h1 className="font-metallica text-6xl">Extras!</h1>
      <h2 className="font-roboto">Next.js의 추가 기능들</h2>
    </div>
  );
}
