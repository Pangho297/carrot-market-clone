import formatToTimeAgo from "@/utils/formatToTimeAgo";
import formatToWon from "@/utils/formatToWon";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function Product({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5 hover:no-underline">
      <div className="relative size-28 overflow-hidden rounded-md">
        <Image fill src={photo} alt={title} className="object-cover" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-lg text-white">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold text-white">
          {formatToWon(price)} 원
        </span>
      </div>
    </Link>
  );
}
