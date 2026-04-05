import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${BASE_URL}/graphql`,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;