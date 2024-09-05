"use server";

import { PAGE_LIMIT } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    where: {
      is_sold: false,
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: PAGE_LIMIT * page,
    take: PAGE_LIMIT,
    orderBy: {
      created_at: "desc",
    },
  });

  return products;
}
