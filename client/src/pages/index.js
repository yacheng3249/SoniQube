import React from "react";
import styled from "styled-components";
import Song from "../components/Song";
import Player from "../components/Player";
import useSignInStore from "../zustand/useSignInStore";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import ConfirmationDialog from "../components/ConfirmationDialog";
import useDialogStatusStore from "../zustand/useDialogStatusStore";
import { useQuery } from "@apollo/client";
import { GET_songs } from "../utils/apolloGraphql";
import { Link } from "react-router-dom";

const Home = ({ audioRef }) => {
  const { token } = useSignInStore();
  const { currentSong, setCurrentSong, setSongs } = useCurrentSongStore();
  const { dialogStatus } = useDialogStatusStore();

  // const { data, loading, refetch } = useQuery(GET_songs, {
  //   fetchPolicy: "network-only",
  //   skip: !token,
  //   onCompleted({ songs }) {
  //     setSongs(songs);
  //     if (!currentSong) {
  //       setCurrentSong(songs[0]);
  //     }
  //   },
  //   onError(error) {
  //     return null;
  //   },
  // });

  return (
    <>
      {token ? (
        currentSong ? (
          <>
            <Song />
            <Player audioRef={audioRef} />
            {/* {dialogStatus ? <ConfirmationDialog refetch={refetch} /> : ""} */}
          </>
        ) : (
          <HomeWrapper>
            <h2>Your library is currently empty.</h2>
            <h4>There are no songs available.</h4>
          </HomeWrapper>
        )
      ) : (
        <HomeWrapper>
          <ImageWrapper>
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
              alt="cover image"
            />
          </ImageWrapper>

          <ButtonWrapper>
            <Link to="/login">
              <button>Sign In</button>
            </Link>
            <Link to="/registration">
              <button>Sign Up</button>
            </Link>
          </ButtonWrapper>
        </HomeWrapper>
      )}
    </>
  );
};

const HomeWrapper = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 20%;
    height: auto;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    // filter: grayscale(100%) sepia(30%) hue-rotate(180deg);
  }

  @media screen and (max-width: 768px) {
    img {
      width: 80%;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 50%;
  min-height: 20vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  button {
    font-size: 18px;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    color: white;
    background-color: #a4b7be;
    box-shadow: 5px 5px 10px #d4d4d4, -5px -5px 10px #ffffff;
    cursor: pointer;

    &:hover {
      background-color: #2c3e50;
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    button {
      padding: 0;
      width: 200px;
      height: 40px;
    }
  }
`;

export default Home;
