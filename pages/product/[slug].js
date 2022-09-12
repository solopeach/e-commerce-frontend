import { useQuery } from "urql";
import { GET_PRODUCT_QUERY } from "../../lib/query";
import { useRouter } from "next/router";
import {
  DetailsStyle,
  ProductInfo,
  Buy,
  Quantity,
} from "../../styles/ProductDetails";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useStateContext } from "../../lib/context";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function ProductDetails() {
  // Use state
  const { qty, increaseQty, decreaseQty, showCart, addToCart, setQty } =
    useStateContext();

  // reset qty
  useEffect(() => {
    setQty(1);
  }, []);

  // Fetch Slug
  // const router = useRouter();
  // console.log(router);
  const { query } = useRouter();

  // Fetch graphql data
  // pass slug into the query function
  const [results] = useQuery({
    query: GET_PRODUCT_QUERY,
    variables: { slug: query.slug },
  });
  const { data, fetching, error } = results;
  console.log(results);

  // Check for the data coming in
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  // extract our data
  const { title, description, image } = data.products.data[0].attributes;

  // Create a toast
  const notify = () => {
    toast.success(`${title} added to your cart`, {
      duration: 1000,
      icon: "🤑",
    });
  };

  console.log(data);
  console.log(qty);
  return (
    <DetailsStyle>
      <img src={image.data.attributes.formats.medium.url} alt={title} />
      <ProductInfo>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <Quantity>
          <span>Quantity</span>
          <button onClick={decreaseQty}>
            <AiFillMinusCircle />
          </button>
          <p>{qty}</p>
          <button onClick={increaseQty}>
            <AiFillPlusCircle />
          </button>
        </Quantity>
        <Buy
          onClick={() => {
            addToCart(data.products.data[0].attributes, qty);
            notify();
          }}
        >
          Add to cart
        </Buy>
      </ProductInfo>
    </DetailsStyle>
  );
}
