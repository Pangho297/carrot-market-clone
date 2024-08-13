"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import { useEffect, useRef, useState } from "react";
import Product from "./Product";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries, observer) => {
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current); // 주시 대상의 callback이 실행되면 주시 해제, 여러번 트리거 되는것을 방지하기 위함, (Effect Dependency에 의해 다시 잡힘)
          setIsLoading(true);
          const newProducts = await getMoreProducts(page);

          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }

          setIsLoading(false);
        }
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -78px 0px",
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="mx-auto w-fit rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold hover:opacity-90 active:scale-95"
        >
          {isLoading ? "불러오는 중..." : "더 보기"}
        </span>
      ) : (
        <div className="w-full text-center">상품을 찾을 수 없습니다</div>
      )}
    </div>
  );
}
