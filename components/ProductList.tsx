"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import { useState } from "react";
import Product from "./Product";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page);

    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setIsLastPage(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <button
          className="mx-auto w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:opacity-90 active:scale-95"
          disabled={isLoading}
          onClick={onClick}
        >
          {isLoading ? "불러오는 중..." : "더 보기"}
        </button>
      ) : (
        <span className="w-full text-center">상품을 더 찾을 수 없습니다</span>
      )}
    </div>
  );
}
