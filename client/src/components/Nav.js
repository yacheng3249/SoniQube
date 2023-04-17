import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import useLibraryStatusStore from "../zustand/useLibraryStatusStore";

// memo avoids this component keeping re-rendering when is unnecessary during parent component is re-rendering
const Nav = React.memo(() => {
  const { setLibraryStatus } = useLibraryStatusStore();

  return (
    <StyleNav>
      <h1>
        <FontAwesomeIcon icon={faMusic} />
      </h1>
      <button onClick={() => setLibraryStatus()}>Library</button>
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
