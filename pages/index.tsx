export default function Home() {
  return (
    <div className="bg-slate-400 py-10 px-5 grid gap-5">
      <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center">
        <span className="w-full text-left font-semibold text-3xl">
          Select Item
        </span>
        <div className="w-full flex justify-between my-2">
          <span className="text-gray-500">Grey Chair</span>
          <span className="font-semibold">$19</span>
        </div>
        <div className="w-full flex justify-between">
          <span className="text-gray-500">Tooly Table</span>
          <span className="font-semibold">$80</span>
        </div>
        <div className="w-full flex justify-between border-t-2 border-dashed mt-2 pt-2">
          <span>Total</span>
          <span className="font-semibold">$99</span>
        </div>
        <button className="mt-5 mx-auto w-2/4 bg-blue-500 text-white rounded-xl p-3">
          Checkout
        </button>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl"></div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl"></div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl"></div>
    </div>
  );
}
