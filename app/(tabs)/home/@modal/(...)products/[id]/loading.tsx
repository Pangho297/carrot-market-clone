import CloseModalBtn from "@/components/CloseModalBtn";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
      <CloseModalBtn />
      <div className="flex h-full w-full max-w-screen-sm items-end justify-center">
        <div className="relative flex h-5/6 w-full flex-col rounded-t-2xl bg-neutral-900">
          <div className="flex animate-pulse flex-col gap-5 p-5">
            <div className="flex aspect-square items-center justify-center rounded-md border-4 border-dashed border-neutral-700 text-neutral-700">
              <PhotoIcon className="h-28" />
            </div>
            <div className="flex items-center gap-2">
              <div className="size-14 rounded-full bg-neutral-700" />
              <div className="flex flex-col gap-1">
                <div className="h-5 w-40 rounded-md bg-neutral-700" />
                <div className="h-5 w-20 rounded-md bg-neutral-700" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-5 w-full rounded-md bg-neutral-700" />
              <div className="h-5 w-full rounded-md bg-neutral-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
