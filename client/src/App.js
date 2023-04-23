import React, { useRef } from "react";
import styled from "styled-components";
//Adding pages and Components
import Home from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/SignUp";
import Library from "./components/Library";
import Nav from "./components/Nav";
//Import Styles
import GlobalStyles from "./components/GlobalStyle";
import useLibraryStatusStore from "./zustand/useLibraryStatusStore";
import { Route, Routes } from "react-router-dom";

function App() {
  const { libraryStatus } = useLibraryStatusStore();
  //Ref
  const audioRef = useRef(null);

  return (
    <StyleApp className={`${libraryStatus ? "library-active" : ""}`}>
      <GlobalStyles />
      <Nav />
      <Routes>
        <Route path="/" element={<Home audioRef={audioRef} />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/registration" element={<SignUp />} />
      </Routes>
      <Library audioRef={audioRef} />
    </StyleApp>
  );
}

const StyleApp = styled.div`
  transition: all 0.5s ease;
`;

export default App;
