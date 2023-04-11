export const playAudio = (isPlaying, audioRef) => {
  // console.log(audioRef.current);
  if (isPlaying) {
    const playPromise = audioRef.current.play();
    playPromise
      ?.then(() => {
        audioRef.current.play();
      })
      .catch((error) => {
        console.log(error);
        // If the playback was interrupted, pause the current request and reload the audio
        if (error.name === "AbortError") {
          audioRef.current.pause();
          audioRef.current.load();
          audioRef.current.play();
        }
      });
  }
};
