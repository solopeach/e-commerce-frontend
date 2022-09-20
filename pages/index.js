import Head from "next/head";
import Link from "next/link";
import { useQuery } from "urql";
import { PRODUCT_QUERY } from "../lib/query";
import Product from "../components/Products";
import { Gallery } from "../styles/Gallery";
import Nav from "../components/Nav";

export default function Home() {
  // Fetch products from strapi
  const [results] = useQuery({ query: PRODUCT_QUERY });
  const { data, fetching, error } = results; // objects keys returned from results
  console.log(results);

  // Check for the data coming in
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  const products = data.products.data;

  console.log(data.products.data);
  return (
    <div>
      <Head>
        <title>Styled Homepage</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Gallery>
          {products.map((product) => (
            // slug thing fixes each child in a list should have a unique key prop error
            <Product key={product.attributes.slug} product={product} /> // props
          ))}
        </Gallery>
      </main>
    </div>
  );
}
