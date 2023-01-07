export default function Home() {
  return (
    <div className="bg-slate-400 py-20 px-20 grid gap-5">
      <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center">
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
      <div className="bg-white overflow-hidden rounded-2xl shadow-2xl">
        <div className="bg-blue-500 p-6 pb-14">
          <span className="text-white text-2xl">Profile</span>
        </div>
        <div className="rounded-3xl p-6 bg-white relative -top-5">
          <div className="flex relative -top-16 justify-between items-end">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-medium">340</span>
            </div>
            <div className="h-24 w-24 rounded-full bg-yellow-400" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Spent</span>
              <span className="font-medium">$2,310</span>
            </div>
          </div>
          <div className="relative -mt-10 -mb-5 flex flex-col items-center">
            <span className="text-lg font-medium">Pangho</span>
            <span className="text-sm text-gray-500">미국</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl"></div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl"></div>
    </div>
  );
}
