"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { useFormStatus } from "react-dom";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loadingText?: string;
}

export default function Button({ loadingText, ...rest }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`primary-btn h-10 disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-300 ${rest.className}`}
      disabled={pending}
      {...rest}
    >
      {pending
        ? loadingText
          ? loadingText
          : "잠시만 기다려주세요"
        : rest.children}
    </button>
  );
}
