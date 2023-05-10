import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import usePlayingStatusStore from "../zustand/usePlayingStatusStore";
import { playAudio } from "../utils";
import { useAlert } from "../providers/AlertProvider";
import { useMutation } from "@apollo/client";
import { delete_song } from "../utils/apolloGraphql";

const LibrarySong = ({ audioRef, refetch, textInput }) => {
  const { alert } = useAlert();
  const { currentSong, setCurrentSong, songs } = useCurrentSongStore();
  const { isPlaying } = usePlayingStatusStore();

  const songSelectHandler = async (song) => {
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

  // const [loadSongs] = useLazyQuery(GET_SONGS, {
  //   onCompleted({ songs }) {
  //     setSongs(songs);
  //   },
  // });

  useEffect(() => {
    if (!textInput) {
      refetch();
    }
  }, [textInput]);

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
            className="button-sm"
            icon={faTrash}
            onClick={() => songDeleteHandler(song)}
          />
        </div>
      ))}
    </div>
  );
};

export default LibrarySong;
