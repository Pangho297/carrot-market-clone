"use client";

import { soldProduct } from "@/app/chats/[id]/actions";
import { ChatRoomProductType } from "@/app/chats/[id]/page";

interface SoldButtonProps {
  product: ChatRoomProductType;
}

export default function SoldButton({ product }: SoldButtonProps) {
  if (!product) return null;

  return (
    <button
      className="rounded-md bg-orange-500 p-2 disabled:bg-neutral-400"
      disabled={product.is_sold}
      onClick={() => soldProduct(product.id)}
    >
      {product.is_sold ? "이미 판매되었습니다" : "판매 완료하기"}
    </button>
  );
}
