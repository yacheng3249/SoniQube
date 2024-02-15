import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";
import { playAudio } from "../utils";
import { delete_song, ADD_SONG } from "../utils/apolloGraphql";
import { useAlert } from "../providers/AlertProvider";
import { useMutation } from "@apollo/client";
import axios from "axios";
import { debounce } from "lodash";

const LibrarySong = ({ audioRef, refetch, textInput }) => {
  const { alert, notify } = useAlert();
  const { currentSong, setCurrentSong, songs, setSongs } =
    useCurrentSongStore();
  const { isPlaying } = usePlayingStatusStore();

  const songSelectHandler = (song) => {
    setCurrentSong(song);
    playAudio(isPlaying, audioRef);
  };

  const [delete_Song_Fn] = useMutation(delete_song, {
    onCompleted({ deleteSong }) {
      if (deleteSong.success) {
        refetch();
      }
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const songDeleteHandler = useCallback(
    (song) => {
      alert(
        "Are you sure you want to delete?",
        `${song.artist} - ${song.name}`,
        [
          {
            text: "CANCEL",
          },
          {
            text: "CONFIRM",
            onClick: () => {
              delete_Song_Fn({
                variables: {
                  songId: song.id,
                },
              });
            },
          },
        ]
      );
    },
    [alert, delete_Song_Fn]
  );

  // search songs
  const fetchData = debounce(async () => {
    try {
      const searchSongURL = `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.REACT_APP_JAMENDO_CLIENT_ID}&format=jsonpretty&limit=10&name=${textInput}`;

      const response = await axios.get(searchSongURL);

      if (response) {
        const songs = response.data.results.map((song) => {
          const { id, name, artist_name, image, audio } = song;
          return {
            id,
            name,
            artist: artist_name,
            cover: image,
            audio,
          };
        });
        setSongs(songs);
      }
    } catch (error) {
      console.error("Error during request", error);
    }
  }, 500);

  useEffect(() => {
    if (!textInput) {
      refetch();
    } else {
      fetchData();

      return () => {
        fetchData.cancel();
      };
    }
  }, [textInput]);

  const [add_Song_Fn] = useMutation(ADD_SONG, {
    onCompleted({ addSong: { message } }) {
      if (message) {
        notify(message);
      } else {
        notify("Song added");
        refetch();
      }
    },
    onError(error) {
      notify(`${error}`);
      return null;
    },
  });

  const songAddHandler = (song) => {
    console.log(song);
    const { name, artist, cover, audio } = song;
    add_Song_Fn({
      variables: {
        songInput: {
          name,
          artist,
          cover,
          audio,
        },
      },
    });
  };

  return (
    <div>
      {songs.map((song) => (
        <div
          key={song.id}
          className={`librarySong-container ${
            song.id === currentSong.id ? "selected" : ""
          }`}
        >
          <div onClick={() => songSelectHandler(song)} className="song-info">
            <img src={song.cover} alt={song.name} />
            <div className="song-description">
              <h3>{song.name}</h3>
              <h4>{song.artist}</h4>
            </div>
          </div>
          <FontAwesomeIcon
            size="1x"
            icon={textInput ? faPlus : faTrash}
            onClick={() =>
              textInput ? songAddHandler(song) : songDeleteHandler(song)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default LibrarySong;
