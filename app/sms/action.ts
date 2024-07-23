"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => validator.isMobilePhone(value, "ko-KR"));

const tokenSchema = z.coerce.number().min(100000).max(999999);

export async function smsLogin(prev: any, formData: FormData) {
  console.log(formData);

  console.log(typeof formData.get("token"));
  console.log(typeof tokenSchema.parse(formData.get("token")));
}
