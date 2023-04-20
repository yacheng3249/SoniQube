import React, { useRef, useEffect } from "react";
import styled from "styled-components";
//Adding Components
import Home from "./pages/index";
import Library from "./components/Library";
import Nav from "./components/Nav";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/SignUp";
//Import Styles
import GlobalStyles from "./components/GlobalStyle";
import useLibraryStatusStore from "./zustand/useLibraryStatusStore";
import useCurrentSongStore from "./zustand/useCurrentSongStore";
import useSignInStore from "./zustand/useSignInStore";
import { useQuery } from "@apollo/client";
import { GET_song } from "./utils/apolloGraphql";
import { Route, Routes } from "react-router-dom";

function App() {
  const { libraryStatus } = useLibraryStatusStore();
  const { currentId, setCurrentSong } = useCurrentSongStore();
  const isSignIn = useSignInStore((state) => state.isSignIn);
  const registration = useSignInStore((state) => state.registration);
  //Ref
  const audioRef = useRef(null);
  const isSubmitted = useRef(false);

  const { data, loading: get_song_loading } = useQuery(GET_song, {
    variables: {
      songId: currentId,
    },
    onError(error) {
      console.log(error);
    },
  });

  return (
    <StyleApp className={`${libraryStatus ? "library-active" : ""}`}>
      <GlobalStyles />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn isSubmitted={isSubmitted} />} />
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
