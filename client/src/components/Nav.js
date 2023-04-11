import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
// import { useDispatch } from 'react-redux';
import useLibraryStatusStore from "../zustand/useLibraryStatusStore";

const Nav = () => {
  // const dispatch = useDispatch();
  const { setLibraryStatus } = useLibraryStatusStore();

  return (
    <StyleNav>
      <h1>Waves</h1>
      <button onClick={() => setLibraryStatus()}>
        Library
        <FontAwesomeIcon icon={faMusic} />
      </button>
    </StyleNav>
  );
};

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
