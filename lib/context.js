import React, { createContext, useContext, useState } from "react";

const ShopContext = createContext();

export const StateContext = ({ children }) => {
  // Add our data for the store
  const [showCart, setShowCart] = useState(false);
  // every time add to cart, save item to cart
  const [cartItems, setCartItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Increase product quantity
  const increaseQty = () => {
    setQty((prevQuantity) => prevQuantity + 1);
  };

  // Decrease product quantity
  const decreaseQty = () => {
    setQty((prevQuantity) => {
      if (prevQuantity == 1) return prevQuantity;
      return prevQuantity - 1;
    });
  };

  const toggleShowCart = () => {
    setShowCart((prevBool) => {
      return !prevBool;
    });
  };

  const addToCart = (product, quantity) => {
    // Total Price
    setTotalPrice((prevTotal) => prevTotal + product.price * quantity);

    // Increase total quantity
    setTotalQuantities((prevTotal) => prevTotal + quantity);
    // Check if the product is already in the cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? // add to existing quantity, leave existing object untouched
              { ...exist, quantity: exist.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
    }
  };

  const removeFromCart = (product) => {
    // Total Price
    setTotalPrice((prevTotal) => prevTotal - product.price);
    // Decrease total quantity
    setTotalQuantities((prevTotal) => prevTotal - 1);
    // Check if the product is already in the cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.slug !== product.slug));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity - 1 }
            : item
        )
      );
    }
  };

  return (
    <ShopContext.Provider
      value={{
        qty,
        increaseQty,
        decreaseQty,
        showCart,
        setShowCart,
        cartItems,
        addToCart,
        removeFromCart,
        totalQuantities,
        totalPrice,
        setQty,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useStateContext = () => useContext(ShopContext);
