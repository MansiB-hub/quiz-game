import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://your-backend.onrender.com/graphql", // Replace with your actual backend URL
  cache: new InMemoryCache(),
});


export { client, ApolloProvider };
