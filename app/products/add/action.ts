"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z.string({
    required_error: "사진을 업로드해 주세요",
  }),
  title: z
    .string({
      required_error: "제목을 입력해 주세요",
    })
    .max(50),
  description: z.string({
    required_error: "설명을 입력해 주세요",
  }),
  price: z.coerce.number({
    required_error: "가격을 입력해 주세요",
  }),
});

export async function uploadProduct(prev: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  /** 로컬에 이미지를 업로드하는 경우 */
  // if (data.photo instanceof File) {
  //   const photoData = await data.photo.arrayBuffer();
  //   // @ts-ignore, 임시 파일 업로드를 위해 파일을 public에 저장
  //   await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
  //   data.photo = `/${data.photo.name}`;
  // }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadUrl() {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  );

  const data = await res.json();
  return data;
}
