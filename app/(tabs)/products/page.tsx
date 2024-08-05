async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function Products() {
  const products = await getProducts();
  return (
    <div>
      <h1 className="text-4xl text-white">상품</h1>
    </div>
  );
}
