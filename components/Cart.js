import { useStateContext } from "../lib/context";
import {
  CartWrapper,
  CartStyle,
  Card,
  CardInfo,
  EmptyStyle,
  Checkout,
  Cards,
} from "../styles/CartStyles";
import { Quantity } from "../styles/ProductDetails";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import getStripe from "../lib/getStripe";

// Animation Variants
const card = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

// Animation Variants
const cards = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.4, staggerChildren: 0.1 },
  },
};

export default function Cart() {
  const { cartItems, setShowCart, addToCart, removeFromCart, totalPrice } =
    useStateContext();
  console.log(cartItems.length);

  // Payment ----------------- STRIPE ---------------------
  const handleCheckout = async () => {
    const stripe = await getStripe();
    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItems),
    });
    const data = await response.json();
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  /* e.stopPropagation will prevent parent function from running in children */
  /* https://api.jquery.com/event.stoppropagation/ */
  return (
    <CartWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} // when element is unmounted from dom
      onClick={() => setShowCart(false)}
    >
      <CartStyle
        initial={{ x: "50%" }}
        animate={{ x: "0%" }}
        exit={{ x: "50%" }} // when element is unmounted from dom
        transition={{ type: "tween" }}
        onClick={(e) => e.stopPropagation()}
      >
        {cartItems.length < 1 && (
          <EmptyStyle
            initial={{ x: "50%" }}
            animate={{ x: "0%" }}
            exit={{ x: "50%" }}
          >
            <h1>You have more shopping to do :P</h1>
            <FaShoppingCart />
          </EmptyStyle>
        )}
        <Cards layout variants={cards} initial="hidden" animate="show">
          {cartItems.length >= 1 &&
            cartItems.map((item) => {
              return (
                <Card layout variants={card} key={item.slug}>
                  <img
                    src={item.image.data.attributes.formats.thumbnail.url}
                    alt={item.title}
                  />
                  <CardInfo>
                    <h3>{item.title}</h3>
                    <h3>${item.price}</h3>
                    <Quantity>
                      <span>Quantity</span>
                      <button>
                        <AiFillMinusCircle
                          onClick={() => removeFromCart(item)}
                        />
                      </button>
                      <p>{item.quantity}</p>
                      <button onClick={() => addToCart(item, 1)}>
                        <AiFillPlusCircle />
                      </button>
                    </Quantity>
                  </CardInfo>
                </Card>
              );
            })}
        </Cards>
        {cartItems.length >= 1 && (
          <Checkout layout>
            <h3>Subtotal: ${totalPrice}</h3>
            <button onClick={handleCheckout}>Purchase</button>
          </Checkout>
        )}
      </CartStyle>
    </CartWrapper>
  );
}
