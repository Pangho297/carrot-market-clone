import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  errorMessage?: string[];
}

export default function FormInput({ errorMessage, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className={`h-10 w-full rounded-md border-none bg-transparent ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-orange-500 ${rest.className}`}
        {...rest}
      />
      {errorMessage?.map((message, index) => (
        <span key={index} className="font-medium text-red-500">
          {message}
        </span>
      ))}
    </div>
  );
}
