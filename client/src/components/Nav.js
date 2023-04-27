import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import useLibraryStatusStore from "../zustand/useLibraryStatusStore";
import useSignInStore from "../zustand/useSignInStore";
import { Link } from "react-router-dom";

// memo avoids this component keeping re-rendering when is unnecessary during parent component is re-rendering
const Nav = React.memo(() => {
  const { setLibraryStatus } = useLibraryStatusStore();

  return (
    <StyleNav>
      <h1>
        <Link to="/">SoniQube</Link>
      </h1>
      <div>
        <Link to="/login">
          <FontAwesomeIcon size="2x" icon={faUserCircle} />
        </Link>
        <button onClick={() => setLibraryStatus()}>Library</button>
      </div>
    </StyleNav>
  );
});

const StyleNav = styled.div`
  min-height: 10vh;
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  h1 {
    font-size: 24px;
    a {
      color: rgb(65, 65, 65);
      text-decoration: none;
    }
  }
  div {
    display: flex;
    align-items: center;
  }
  button {
    background: transparent;
    color: rgb(65, 65, 65);
    cursor: pointer;
    border: 2px solid rgb(65, 65, 65);
    padding: 0.5rem;
    transition: all 0.3s ease;
  }
  button:hover {
    background: rgb(65, 65, 65);
    color: white;
  }
  svg {
    margin-right: 1rem;
    color: rgb(65, 65, 65);
  }
  @media screen and (max-width: 768px) {
    width: 90%;
    justify-content: space-between;
    button {
      z-index: 10;
    }
  }
`;

export default Nav;
