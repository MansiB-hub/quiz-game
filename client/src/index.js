import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
