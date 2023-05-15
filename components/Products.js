import { ProductStyle } from "../styles/ProductStyle";
import Link from "next/link";

export default function Product({ product }) {
  // Extract the info from props
  const { title, price, image, slug } = product.attributes;
  console.log(product.attributes);

  return (
    <ProductStyle>
      <div>
        <Link href={`/product/${slug}`}>
          <img src={image.data.attributes.formats.small.url} alt="" />
        </Link>
      </div>
      <h2>{title}</h2>
      <h3>${price}</h3>
    </ProductStyle>
  );
}
