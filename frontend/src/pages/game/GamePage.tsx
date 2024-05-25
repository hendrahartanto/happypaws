import GameCanvas from "../../game/GameCanvas";
import bgMusic from "../../assets/game_asset/background music 1.mp3";
import useFetch from "../../hooks/useFetch";
import Unauthorized from "../../components/Unauthorized";

const GamePage = () => {
  const { unauthorized } = useFetch("http://localhost:8080/user/validateAuth");

  if (unauthorized) {
    return <Unauthorized />;
  }

  const backgroundMusic = new Audio(bgMusic);
  const playBackgroundMusic = () => {
    backgroundMusic.loop = true;
    backgroundMusic.play();
  };

  window.addEventListener("keydown", playBackgroundMusic, { once: true });

  return (
    <div className="game-page">
      <GameCanvas />
    </div>
  );
};

export default GamePage;
