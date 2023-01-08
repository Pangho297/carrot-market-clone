export default function Home() {
  return (
    <div className="bg-slate-400 dark dark:bg-slate-700 py-20 px-20 grid gap-10 lg:grid-cols-2 xl:grid-cols-4 xl:place-content-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-3xl shadow-2xl flex flex-col justify-between items-center">
        <span className="w-full text-left font-semibold text-3xl">
          Select Item
        </span>
        <ul className="w-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between my-2 even:bg-yellow-50 odd:bg-blue-50"
            >
              <span className="text-gray-500">Grey Chair</span>
              <span className="font-semibold">$19</span>
            </div>
          ))}
        </ul>
        <ul className="w-full">
          {["a", "b", "c", ""].map((item, index) => (
            <li key={index} className="bg-yellow-50 py-2 empty:bg-yellow-400">
              {item}
            </li>
          ))}
        </ul>
        <div className="w-full flex justify-between border-t-2 border-dashed mt-2 pt-2">
          <span>Total</span>
          <span className="font-semibold">$99</span>
        </div>
        <button className="mt-5 mx-auto w-2/4 bg-blue-500 text-white dark:bg-slate-700 rounded-xl p-3 transition hover:bg-blue-400 hover:text-yellow-300">
          Checkout
        </button>
      </div>
      <div className="bg-white overflow-hidden rounded-2xl shadow-2xl group">
        <div className="bg-blue-500 landscape:bg-pink-400 p-6 pb-14 lg:pb-48 xl:pb-56">
          <span className="text-white text-2xl">Profile</span>
        </div>
        <div className="rounded-3xl p-6 bg-white relative -top-5">
          <div className="flex relative -top-16 justify-between items-end">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-medium">340</span>
            </div>
            <div className="h-24 w-24 rounded-full bg-yellow-400 group-hover:bg-pink-400 transition-colors" />
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
      <div className="bg-white p-10 rounded-2xl shadow-2xl">
        <div className="flex mb-5 justify-between items-center">
          <span>⬅️</span>
          <div className="space-x-3">
            <span>⭐️ 4.9</span>
            <span className="shadow-xl p-2 rounded-md">💖</span>
          </div>
        </div>
        <div className="bg-zinc-400 h-72 mb-5" />
        <div className="flex flex-col">
          <span className="font-medium text-xl">Swoon Lounge</span>
          <span className="text-xs text-gray-500">Chair</span>
          <div className="mt-3 mb-5 flex justify-between items-center">
            <div className="space-x-3">
              <button className="w-5 h-5 rounded-full  bg-yellow-400 focus:ring-2 ring-offset-2 focus:ring-yellow-400 transition"></button>
              <button className="w-5 h-5 rounded-full  bg-pink-400 focus:ring-2 ring-offset-2 focus:ring-pink-400 transition"></button>
              <button className="w-5 h-5 rounded-full  bg-blue-400 focus:ring-2 ring-offset-2 focus:ring-blue-400 transition"></button>
            </div>
            <div className="flex items-center space-x-5">
              <button className="rounded-lg bg-blue-200 flex justify-center items-center aspect-square w-8 text-xl text-gray-500">
                -
              </button>
              <span>1</span>
              <button className="rounded-lg bg-blue-200 flex justify-center items-center aspect-square w-8 text-xl text-gray-500">
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-2xl">$450</span>
            <button className="py-2 px-8 bg-blue-500 text-xs text-white rounded-lg">
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl flex justify-center items-center">
        <form className="w-full flex flex-col space-y-2 bg-blue-400 rounded-2xl p-5 focus-within:bg-blue-50 transition-colors">
          <input
            type="text"
            required
            placeholder="Username"
            className="peer required:bg-yellow-50 invalid:border invalid:border-pink-400 valid:bg-blue-400 valid:text-white rounded-md transition-colors"
          />
          <span className="peer-invalid:text-pink-400 peer-valid:hidden">
            this input is invalid
          </span>
          <span className="peer-invalid:hidden">👍</span>
          <input
            type="password"
            required
            placeholder="Password"
            className="required:bg-yellow-50 invalid:border invalid:border-pink-400 valid:bg-blue-400 valid:text-white rounded-md transition-colors"
          />
          <input type="submit" value="login" className="text-white" />
        </form>
      </div>
    </div>
  );
}
