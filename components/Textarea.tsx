"use client";

import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string; // name 값을 넣는것을 강제하기 위해 추가
  height?: string;
  errorMessage?: string[];
  showLength?: boolean;
  length?: number;
}

const _Textarea = (
  { errorMessage = [], height, showLength = false, length = 0, ...rest }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  return (
    <div
      className={`flex flex-col gap-2 ${height ? `h-${height}` : "h-52"} relative`}
    >
      <textarea
        className={`h-full w-full rounded-md border-none bg-transparent ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500 ${rest.className} resize-none`}
        ref={ref}
        {...rest}
      />
      {errorMessage?.map((message, index) => (
        <span key={index} className="font-medium text-red-500">
          {message}
        </span>
      ))}
      {showLength && (
        <div className="absolute bottom-2 right-3 text-neutral-600">
          {length} / 200
        </div>
      )}
    </div>
  );
};

export default forwardRef(_Textarea);
