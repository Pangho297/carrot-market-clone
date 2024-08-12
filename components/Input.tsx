import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // name 값을 넣는것을 강제하기 위해 추가
  errorMessage?: string[];
}

const _Input = (
  { errorMessage = [], ...rest }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        className={`h-10 w-full rounded-md border-none bg-transparent ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500 ${rest.className}`}
        ref={ref}
        {...rest}
      />
      {errorMessage?.map((message, index) => (
        <span key={index} className="font-medium text-red-500">
          {message}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Input);
