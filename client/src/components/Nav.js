import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import useLibraryStatusStore from "../zustand/useLibraryStatusStore";
import useSignInStore from "../zustand/useSignInStore";
import { Link } from "react-router-dom";

// memo avoids this component keeping re-rendering when is unnecessary during parent component is re-rendering
const Nav = React.memo(() => {
  const { setLibraryStatus } = useLibraryStatusStore();
  const { setSignInActive, setInActive } = useSignInStore();

  return (
    <StyleNav>
      <h1>
        <Link to="/">
          <FontAwesomeIcon icon={faMusic} />
        </Link>
      </h1>
      <div>
        <button>
          <Link to="/login">
            <FontAwesomeIcon size="1x" icon={faUser} />
          </Link>
        </button>
        <button onClick={() => setLibraryStatus()}>Library</button>
      </div>
    </StyleNav>
  );
});

const StyleNav = styled.div`
  min-height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  button {
    background: transparent;
    cursor: pointer;
    border: 2px solid rgb(65, 65, 65);
    padding: 0.5rem;
    transition: all 0.3s ease;
  }
  button:hover {
    background: rgb(65, 65, 65);
    color: white;
  }
  @media screen and (max-width: 768px) {
    button {
      z-index: 10;
    }
  }
`;

export default Nav;
