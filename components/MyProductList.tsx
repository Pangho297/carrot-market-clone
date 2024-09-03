"use client";

import {
  getMoreSaleProducts,
  getMoreSoldProducts,
} from "@/app/(tabs)/profile/[[...id]]/actions";
import { InitialSaleProducts } from "@/app/(tabs)/profile/[[...id]]/page";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SaleListProps {
  initialProducts: InitialSaleProducts;
  id: number;
  isSold: boolean;
}

export default function MyProductList({
  initialProducts,
  id,
  isSold,
}: SaleListProps) {
  const [productList, setProductList] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries, observer) => {
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          const newProducts = isSold
            ? await getMoreSoldProducts(page, id)
            : await getMoreSaleProducts(page, id);

          if (newProducts.products.length !== 0) {
            setPage((prev) => prev + 1);
            setProductList((prev) => ({
              products: [...prev.products, ...newProducts.products],
              totalCount: prev.totalCount,
            }));
          } else {
            setIsLastPage(true);
          }
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, id]);

  return (
    <div className="flex flex-col gap-5 p-5">
      <h3 className="text-2xl font-bold">
        {isSold ? "판매된 물품" : "판매 중인 물품"} ({productList.totalCount})
      </h3>
      <div className="scrollbar-hide flex max-w-screen-md gap-5 overflow-auto">
        {productList.products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="flex h-[316px] w-52 flex-col gap-2">
              <Image
                width={208}
                height={208}
                src={`${product.photo}/public`}
                alt={product.title}
                className="h-[258px] w-52 rounded-md object-cover"
              />

              <p className="text-xl font-bold text-white">{product.title}</p>
              <p className="text-neutral-400">
                {product.price.toLocaleString("ko-KR")} 원
              </p>
            </div>
          </Link>
        ))}
        {!isLastPage && <span ref={trigger} />}
      </div>
    </div>
  );
}
