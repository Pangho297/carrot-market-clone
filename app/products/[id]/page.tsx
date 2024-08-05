interface ParamsType {
  id: string;
}

interface ProductDetailProps {
  params: ParamsType;
}

async function getProduct() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function ProductDetail({
  params: { id },
}: ProductDetailProps) {
  await getProduct();
  return <div>상품 {id}의 상세 정보</div>;
}
