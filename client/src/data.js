import { v4 as uuidv4 } from "uuid";

function chillHop() {
  return [
    {
      name: "Toofpick",
      artist: "Blue Wednesday, Shopan",
      cover:
        "https://chillhop.com/wp-content/uploads/2020/12/33a2a875828118a3ff260638a88362936104879a-1024x1024.jpg",
      id: 2,
      active: true,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=11227",
    },
    {
      name: "Déjà Vu",
      artist: "Blue Wednesday, Shopan",
      cover:
        "https://chillhop.com/wp-content/uploads/2020/12/33a2a875828118a3ff260638a88362936104879a-1024x1024.jpg",
      id: uuidv4(),
      active: false,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=11229",
    },
    {
      name: "There and Back",
      artist: "Shopan",
      cover:
        "https://chillhop.com/wp-content/uploads/2021/02/08cbb0848f669e1bd8b5a5152c4b7d20edf1b499-1024x1024.jpg",
      id: uuidv4(),
      active: false,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=10311",
    },
    {
      name: "Lax Incense",
      artist: "Mama Aiuto, Daphné",
      cover:
        "https://chillhop.com/wp-content/uploads/2021/01/6b1bb8736ee3e972747bc11f312e31cf7f5823e4-1024x1024.jpg",
      id: uuidv4(),
      active: false,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=12125",
    },
    {
      name: "Who Knows",
      artist: "Psalm Trees, Guillaume Muschalle",
      cover:
        "https://chillhop.com/wp-content/uploads/2020/10/371dadcad6dee874bd96515ae5d19b6daef2f408-1024x1024.jpg",
      id: uuidv4(),
      active: false,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=10553",
    },
    {
      name: "Flashback",
      artist: "Blue Wednesday, Shopan",
      cover:
        "https://chillhop.com/wp-content/uploads/2020/12/33a2a875828118a3ff260638a88362936104879a-1024x1024.jpg",
      id: uuidv4(),
      active: false,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=11225",
    },
    {
      name: "vhs tapes 1993-1996",
      artist: "Sundreamer, edapollo",
      cover:
        "https://chillhop.com/wp-content/uploads/2021/02/08cbb0848f669e1bd8b5a5152c4b7d20edf1b499-1024x1024.jpg",
      id: uuidv4(),
      active: false,
      // color: ["#007cba", "#005a87"],
      audio: "https://mp3.chillhop.com/serve.php/?mp3=9335",
    },
  ];
}

export default chillHop;
