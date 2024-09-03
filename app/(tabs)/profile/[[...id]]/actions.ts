"use server";

import { PAGE_LIMIT } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreSaleProducts(page: number, id: number) {
  const totalCount = await db.product.findMany({
    where: {
      user_id: id,
      is_sold: false,
    },
    select: {
      id: true,
    },
  });
  const products = await db.product.findMany({
    where: {
      user_id: id,
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

  return { products, totalCount: totalCount.length };
}

export async function getMoreSoldProducts(page: number, id: number) {
  const totalCount = await db.product.findMany({
    where: {
      user_id: id,
      is_sold: true,
    },
    select: {
      id: true,
    },
  });
  const products = await db.product.findMany({
    where: {
      user_id: id,
      is_sold: true,
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

  return { products, totalCount: totalCount.length };
}

export async function getMoreTargetReviews(page: number, id: number) {
  const totalCount = await db.review.findMany({
    where: {
      target_id: id,
    },
    select: {
      target_id: true,
    },
  });
  const reviews = await db.review.findMany({
    where: {
      target_id: id,
    },
    select: {
      target_id: true,
      writer: {
        select: {
          username: true,
          avatar: true,
        },
      },
      payload: true,
    },
    skip: PAGE_LIMIT * page,
    take: PAGE_LIMIT,
    orderBy: {
      created_at: "desc",
    },
  });

  return { reviews, totalCount: totalCount.length };
}

export async function getMoreWriteReviews(page: number, id: number) {
  const totalCount = await db.review.findMany({
    where: {
      writer_id: id,
    },
    select: {
      writer_id: true,
    },
  });
  const reviews = await db.review.findMany({
    where: {
      writer_id: id,
    },
    select: {
      writer_id: true,
      target: {
        select: {
          username: true,
          avatar: true,
        },
      },
      payload: true,
    },
    skip: PAGE_LIMIT * page,
    take: PAGE_LIMIT,
    orderBy: {
      created_at: "desc",
    },
  });

  return { reviews, totalCount: totalCount.length };
}
