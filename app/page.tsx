export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 p-5 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100">
      <div className="flex w-full max-w-screen-sm flex-col gap-2 rounded-3xl bg-white p-5 shadow-lg ring ring-transparent transition-shadow *:outline-none has-[:invalid]:ring-red-500 md:flex-row">
        <input
          className="peer w-full rounded-full bg-gray-200 py-3 pl-5 ring ring-transparent transition-shadow placeholder:drop-shadow focus:ring-cyan-500 focus:ring-offset-2 invalid:focus:ring-red-500"
          type="text"
          placeholder="Email Address"
          required
        />
        <span className="hidden font-medium text-red-500 peer-invalid:block">
          Email is Require
        </span>
        <button className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-400 py-2 font-medium text-white transition-transform active:scale-90 peer-invalid:from-orange-100 peer-invalid:to-red-100 peer-invalid:text-red-500 md:px-10">
          Login
        </button>
      </div>
    </main>
  );
}
