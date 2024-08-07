"use server"

export async function uploadProduct(prev: any, formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description")
  }

  console.log(data);
}