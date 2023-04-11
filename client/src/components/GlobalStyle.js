import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  *::-webkit-scrollbar {
    width: 5px;
  }
  *::-webkit-scrollbar-track {
    background: transparent;
  }
  *::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }

  h1, h2 {
    color: rgb(54, 54, 54);
  }

  h3, h4 {
      font-weight: 400;
      color: rgb(100, 100, 100);
  }

  body {
    font-family: 'Lato', sans-serif;
  }

  .selected {
    background: rgb(165, 181, 228);
  }

  .active-library {
    transform: translateX(0%);
    opacity: 1;
  }

  .library-active {
    margin-left: 20%;
}
`;

export default GlobalStyles;
