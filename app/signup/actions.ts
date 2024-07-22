"use server";
import { z } from "zod";

const usernameSchema = z.string().min(2).max(10);

export async function createAccount(prev: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm_password"),
  };

  usernameSchema.parse(data.username);
}
