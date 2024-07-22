"use server";

export async function onSubmit(state: any, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // 임의의 지연 처리
  console.log(formData.get("email"), formData.get("password"));

  return {
    errors: ["wrong password", "password too short"],
  };
}
