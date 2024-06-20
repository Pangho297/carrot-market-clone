import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loadingText?: string;
}

export default function FormButton({ loadingText, ...rest }: Props) {
  return (
    <button
      className={`primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300 ${rest.className}`}
      {...rest}
    >
      {rest.disabled
        ? loadingText
          ? loadingText
          : "잠시만 기다려주세요"
        : rest.children}
    </button>
  );
}
