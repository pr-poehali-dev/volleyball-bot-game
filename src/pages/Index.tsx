import { useState } from "react";
import { Player } from "@/data/players";
import MainMenu from "./MainMenu";
import TeamSelect from "./TeamSelect";
import GameScreen from "./GameScreen";
import VolleyGameScreen from "./VolleyGameScreen";
import MatchResults from "./MatchResults";
import Gallery from "./Gallery";
import Profile from "./Profile";

type Screen = "menu" | "team-select" | "game" | "results" | "gallery" | "profile";

interface GameResult {
  myScore: number;
  enemyScore: number;
  team: Player[];
}

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [team, setTeam] = useState<Player[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);

  const handleStartGame = (selectedTeam: Player[]) => {
    setTeam(selectedTeam);
    setScreen("game");
  };

  const handleEndGame = (res: GameResult) => {
    setResult(res);
    setScreen("results");
  };

  if (screen === "menu") {
    return (
      <MainMenu
        onPlay={() => setScreen("team-select")}
        onGallery={() => setScreen("gallery")}
        onProfile={() => setScreen("profile")}
      />
    );
  }

  if (screen === "team-select") {
    return (
      <TeamSelect
        onBack={() => setScreen("menu")}
        onStartGame={handleStartGame}
      />
    );
  }

  if (screen === "game" && team.length > 0) {
    return (
      <VolleyGameScreen
        team={team}
        onEndGame={handleEndGame}
      />
    );
  }

  if (screen === "results" && result) {
    return (
      <MatchResults
        myScore={result.myScore}
        enemyScore={result.enemyScore}
        team={result.team}
        onPlayAgain={() => setScreen("team-select")}
        onMainMenu={() => setScreen("menu")}
      />
    );
  }

  if (screen === "gallery") {
    return <Gallery onBack={() => setScreen("menu")} />;
  }

  if (screen === "profile") {
    return <Profile onBack={() => setScreen("menu")} />;
  }

  return null;
}