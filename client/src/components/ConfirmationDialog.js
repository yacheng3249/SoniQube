import React from "react";
import styled from "styled-components";
import useDialogStatusStore from "../zustand/useDialogStatusStore";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import { useMutation } from "@apollo/client";
import { delete_song } from "../utils/apolloGraphql";

const ConfirmationDialog = ({ refetch }) => {
  const { dialogContent, setDialogStatusInactive } = useDialogStatusStore();
  const { selectedDeleteSong, setSelectedDeleteSong } = useCurrentSongStore();

  const [delete_Song_Fn, { loading }] = useMutation(delete_song, {
    onCompleted({ deleteSong }) {
      if (deleteSong.success) {
        setSelectedDeleteSong(null);
        refetch();
        setDialogStatusInactive();
      }
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const handleConfirm = () => {
    delete_Song_Fn({
      variables: {
        songId: selectedDeleteSong.id,
      },
    });
  };

  const handleCancel = () => {
    setDialogStatusInactive();
  };

  return (
    <DialogOverlay>
      <Dialog>
        <h2>{dialogContent.title}</h2>
        <p>{dialogContent.message}</p>
        <DialogButtons>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleConfirm}>Confirm</button>
        </DialogButtons>
      </Dialog>
    </DialogOverlay>
  );
};

const DialogOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  z-index: 999;
`;

const Dialog = styled.div`
  background-color: rgb(65, 65, 65);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 1;
  h2 {
    margin-top: 0;
    font-size: 18px;
    color: white;
  }
  p {
    color: white;
    font-size: 12px;
  }
`;

const DialogButtons = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 16px;
    margin: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: #007bff;
    color: #fff;

    &:hover {
      background-color: #f1f1f1;
    }
  }
`;

export default ConfirmationDialog;
