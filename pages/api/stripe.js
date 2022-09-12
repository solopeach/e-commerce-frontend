import Stripe from "stripe";
import { getSession } from "@auth0/nextjs-auth0";
// eslint-disable-next-line no-undef
const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

export default async function handler(req, res) {
  const session = getSession(req, res); // not being used
  const user = session?.user;
  console.log(session);
  console.log("hey");

  if (req.method === "POST") {
    try {
      // console.log(req);
      // Create Stripe session
      if (user) {
        const stripeId = user["http://localhost:3000/stripe_customer_id"];
        const session = await stripe.checkout.sessions.create({
          submit_type: "pay",
          mode: "payment",
          customer: stripeId,
          payment_method_types: ["card"],
          shipping_address_collection: {
            allowed_countries: ["US", "CA"],
          },
          shipping_options: [
            { shipping_rate: "shr_1LdFG3JB9aSKApVSaX4Ald3m" },
            { shipping_rate: "shr_1LdFj1JB9aSKApVSqF9Ufxg1" },
          ],
          allow_promotion_codes: true,
          line_items: req.body.map((item) => {
            return {
              price_data: {
                currency: "cad",
                product_data: {
                  name: item.title,
                  images: [item.image.data.attributes.formats.thumbnail.url],
                },
                unit_amount: item.price * 100, // bc by default it does in decimals?
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
              },
              quantity: item.quantity,
            };
          }),
          // Bring people to the success or failed page
          success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/canceled`,
        });
        res.status(200).json(session); // create a response and status of 200, send back the
        // json format of the session
      } else {
        const session = await stripe.checkout.sessions.create({
          submit_type: "pay",
          mode: "payment",
          payment_method_types: ["card"],
          shipping_address_collection: {
            allowed_countries: ["US", "CA"],
          },
          shipping_options: [
            { shipping_rate: "shr_1LdFG3JB9aSKApVSaX4Ald3m" },
            { shipping_rate: "shr_1LdFj1JB9aSKApVSqF9Ufxg1" },
          ],
          allow_promotion_codes: true,
          line_items: req.body.map((item) => {
            return {
              price_data: {
                currency: "cad",
                product_data: {
                  name: item.title,
                  images: [item.image.data.attributes.formats.thumbnail.url],
                },
                unit_amount: item.price * 100, // bc by default it does in decimals?
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
              },
              quantity: item.quantity,
            };
          }),
          // Bring people to the success or failed page
          success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/canceled`,
        });
        res.status(200).json(session); // create a response and status of 200, send back the
        // json format of the session
      }
    } catch (error) {
      res.status(error.statusCode || 500).json(error.message);
    }
  }
}
