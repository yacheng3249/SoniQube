import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  :root {
    --bg: #EBEBEB;
    --black: #333333;
    --prog: #A4B7BE;
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
    color: rgb(65, 65, 65);
  }

  h3, h4 {
      font-weight: 400;
      color: rgb(100, 100, 100);
  }

  body {
    font-family: 'Lato', sans-serif;
  }

  input[type="range"]:focus {
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
  }

  .track {
    background: var(--prog);
    width: 100%;
    height: 1rem;
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
  }

  .animate-track {
    background: linear-gradient(145deg, #fbfbfb, #d4d4d4);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(0%);
    pointer-events: none;
  }

  .selected {
    background: var(--prog);
  }

  .active-library {
    transform: translateX(0%);
    opacity: 1;
  }

  .library-active {
    margin-left: 20%;
  }

  .spin-begin {
    animation: spin 10s linear infinite;
    animation-fill-mode: forwards;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .spin-pause {
    animation-play-state: paused;
    animation-fill-mode: forwards;
  }

  .open {
    display: flex;
  }

  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    cursor: pointer;

    height: 20px;
    width: 20px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
}
  
`;

export default GlobalStyles;
