import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";
import { BrowserRouter } from "react-router-dom";
// import ReactDOM from "react-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import useSignInStore from "./zustand/useSignInStore";
import reportWebVitals from "./reportWebVitals";

// const httpLink = createHttpLink({
//   uri: "http://localhost:4000",
// });

const httpLink = createHttpLink({
  uri: "https://rdx0iz8tx5.execute-api.ap-east-1.amazonaws.com/dev/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = useSignInStore.getState().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <ApolloProvider client={client}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </ApolloProvider>
);
// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </ApolloProvider>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
