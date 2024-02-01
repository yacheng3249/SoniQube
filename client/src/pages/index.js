import React from "react";
import Song from "../components/Song";
import Player from "../components/Player";
import useSignInStore from "../zustand/useSignInStore";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import { Link } from "react-router-dom";
import recordPlayer from "../img/record-player.jpg";

const Home = ({ audioRef }) => {
  const { token } = useSignInStore();
  const { currentSong } = useCurrentSongStore();

  return (
    <>
      {token ? (
        currentSong ? (
          <>
            <Song />
            <Player audioRef={audioRef} />
          </>
        ) : (
          <div className="home-container">
            <h2>Your library is currently empty.</h2>
            <h4>There are no songs available.</h4>
          </div>
        )
      ) : (
        <div className="home-container">
          <img className="home-image" src={recordPlayer} alt="cover image" />
          <div className="button-wrapper">
            <Link to="/login">
              <button>Sign In</button>
            </Link>
            <Link to="/registration">
              <button>Sign Up</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
