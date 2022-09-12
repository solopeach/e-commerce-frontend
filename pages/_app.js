/* eslint-disable no-undef */
import "../styles/globals.css";
import { Provider, createClient } from "urql";
import Nav from "../components/Nav";
import { StateContext } from "../lib/context";
import { UserProvider } from "@auth0/nextjs-auth0";
import { Toaster } from "react-hot-toast";

// nav and footer here to render on every page

console.log(process.env.NEXT_PUBLIC_BACKEND_API);
console.log("hey");
// want to replace the localhost with an env variable but after deploying,
// it will be a diff url

// const client = createClient({ url: "http://localhost:1337:graphql" });
// const client = createClient({ url: process.env.BACKEND_API });

const client = createClient({ url: process.env.NEXT_PUBLIC_BACKEND_API });

function MyApp({ Component, pageProps }) {
  return (
    // provider gives access to graphql backend
    <UserProvider>
      <StateContext>
        <Provider value={client}>
          <Toaster />
          <Nav />
          <Component {...pageProps} />
        </Provider>
      </StateContext>
    </UserProvider>
  );
}

export default MyApp;
