import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const stripe = require("stripe")(
  // eslint-disable-next-line no-undef
  `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`
);
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";

// get back different payments user has made
// getServerSideProps is a nextjs function that fetches data on pre-render
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = getSession(ctx.req, ctx.res);
    // eslint-disable-next-line no-undef
    const stripeId = session.user[`${process.env.BASE_URL}/stripe_customer_id`];
    // just the localhost:3000/stripe_customer_id url
    const paymentIntents = await stripe.paymentIntents.list({
      customer: stripeId,
    });
    return { props: { orders: paymentIntents.data } };
  },
});

export default function Profile({ user, orders }) {
  const route = useRouter();
  console.log(orders[0]);
  return (
    user && (
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <div>
          {orders.map((order) => (
            <Order key={order.id}>
              <h1>Order Number: {order.id}</h1>
              <h2>{formatMoney(order.amount)}</h2>
              <h2>Receipt Email: {user.email}</h2>
            </Order>
          ))}
        </div>
        <button onClick={() => route.push("/api/auth/logout")}>Logout</button>
      </div>
    )
  );
}

const Order = styled.div`
  background: white;
  margin: 2rem 0rem;
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  h1 {
    font-size: 1rem;
  }
`;
