import { useState, useEffect, useCallback } from "react";
import { Player } from "@/data/players";
import CharacterFace from "@/components/CharacterFace";

interface GameScreenProps {
  team: Player[];
  onEndGame: (result: { myScore: number; enemyScore: number; team: Player[] }) => void;
}

const ENEMY_PLAYERS: { color: string; face: string; name: string }[] = [
  { color: "#E74C3C", face: "😈", name: "Злодей" },
  { color: "#8E44AD", face: "👺", name: "Монстр" },
  { color: "#2C3E50", face: "🤖", name: "Робот" },
  { color: "#C0392B", face: "😤", name: "Злюка" },
  { color: "#7D3C98", face: "🧟", name: "Зомби" },
  { color: "#1A252F", face: "👿", name: "Тёмный" },
];

export default function GameScreen({ team, onEndGame }: GameScreenProps) {
  const [myScore, setMyScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [time, setTime] = useState(90);
  const [events, setEvents] = useState<string[]>([]);
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [animatingPlayer, setAnimatingPlayer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [lastEvent, setLastEvent] = useState<{ text: string; color: string } | null>(null);

  const randomPlayer = useCallback(() => team[Math.floor(Math.random() * team.length)], [team]);

  const addEvent = useCallback((text: string, color: string) => {
    setLastEvent({ text, color });
    setEvents((prev) => [text, ...prev].slice(0, 4));
    setTimeout(() => setLastEvent(null), 2500);
  }, []);

  const doGoal = useCallback((isMyGoal: boolean) => {
    const player = randomPlayer();
    setBallPos({ x: isMyGoal ? 95 : 5, y: 50 });
    setAnimatingPlayer(player.id);
    setTimeout(() => setAnimatingPlayer(null), 800);

    if (isMyGoal) {
      setMyScore((s) => s + 1);
      addEvent(`⚽ ГОЛ! ${player.name} забивает!`, "#22c55e");
    } else {
      setEnemyScore((s) => s + 1);
      addEvent(`😱 Гол в наши ворота!`, "#ef4444");
    }
    setBallPos({ x: 50, y: 50 });
  }, [randomPlayer, addEvent]);

  const doMiss = useCallback(() => {
    const player = randomPlayer();
    setBallPos({ x: 80, y: Math.random() > 0.5 ? 25 : 75 });
    addEvent(`😬 ${player.name} промахнулся!`, "#f59e0b");
    setTimeout(() => setBallPos({ x: 50, y: 50 }), 1000);
  }, [randomPlayer, addEvent]);

  const doDribble = useCallback(() => {
    const player = randomPlayer();
    setBallPos({ x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 });
    addEvent(`🌀 ${player.name} обходит защитников!`, "#8b5cf6");
  }, [randomPlayer, addEvent]);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const event = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.25) doGoal(true);
      else if (rand < 0.38) doGoal(false);
      else if (rand < 0.55) doMiss();
      else doDribble();
    }, 2500);
    return () => clearInterval(event);
  }, [gameOver, doGoal, doMiss, doDribble]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const myWinning = myScore > enemyScore;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col">
      {/* Scoreboard */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className={`w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-sm transition-transform duration-300 ${animatingPlayer === p.id ? "scale-150" : ""}`}
                style={{ backgroundColor: p.color }}
              >
                {p.face}
              </div>
            ))}
          </div>
          <span className="font-black text-2xl text-green-400">{myScore}</span>
        </div>

        <div className="text-center">
          <div className="bg-yellow-400 text-gray-900 rounded-xl px-3 py-1 font-black text-lg">
            {minutes}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">⚽ матч</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-2xl text-red-400">{enemyScore}</span>
          <div className="flex -space-x-2">
            {ENEMY_PLAYERS.slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-sm"
                style={{ backgroundColor: p.color }}
              >
                {p.face}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field */}
      <div className="flex-1 relative max-w-2xl mx-auto w-full overflow-hidden">
        {/* Grass */}
        <div className="absolute inset-0 grass-pattern opacity-60" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(45,122,58,0.7) 0%, rgba(52,138,67,0.7) 100%)"
        }} />

        {/* Field lines */}
        <div className="absolute inset-4 border-2 border-white/40 rounded" />
        <div className="absolute top-4 bottom-4 left-1/2 -translate-x-px w-0.5 bg-white/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/40" />

        {/* Goals */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-16 border-2 border-white/60 border-l-0 bg-white/10 rounded-r" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-16 border-2 border-white/60 border-r-0 bg-white/10 rounded-l" />

        {/* Ball */}
        <div
          className="absolute w-8 h-8 transition-all duration-700 ease-in-out z-10"
          style={{
            left: `${ballPos.x}%`,
            top: `${ballPos.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="text-2xl drop-shadow-lg">⚽</span>
        </div>

        {/* My team players */}
        <div className="absolute left-0 top-0 bottom-0 w-2/5 flex flex-col justify-around items-center py-6 pl-4">
          {team.map((p, i) => (
            <div
              key={p.id}
              className={`transition-all duration-300 ${animatingPlayer === p.id ? "scale-125" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CharacterFace color={p.color} face={p.face} size={38} jersey={p.name.split(" ")[1]?.slice(0, 3) ?? p.name.slice(0, 3)} />
            </div>
          ))}
        </div>

        {/* Enemy players */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 flex flex-col justify-around items-center py-6 pr-4">
          {ENEMY_PLAYERS.map((p, i) => (
            <div key={i}>
              <CharacterFace color={p.color} face={p.face} size={38} jersey={p.name.slice(0, 3)} />
            </div>
          ))}
        </div>

        {/* Last event popup */}
        {lastEvent && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl font-black text-white text-sm whitespace-nowrap shadow-xl z-20 animate-bounce-in"
            style={{ backgroundColor: lastEvent.color }}
          >
            {lastEvent.text}
          </div>
        )}

        {/* Winning banner */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
            <div className="bg-white rounded-3xl p-8 text-center animate-scale-in shadow-2xl">
              <div className="text-6xl mb-2">{myWinning ? "🏆" : myScore === enemyScore ? "🤝" : "😢"}</div>
              <div className="font-black text-3xl text-gray-800 mb-1">
                {myWinning ? "ПОБЕДА!" : myScore === enemyScore ? "НИЧЬЯ!" : "ПОРАЖЕНИЕ"}
              </div>
              <div className="text-2xl font-black text-gray-600 mb-4">{myScore} : {enemyScore}</div>
              <button
                onClick={() => onEndGame({ myScore, enemyScore, team })}
                className="bg-green-500 text-white font-black text-lg px-8 py-3 rounded-2xl btn-press"
              >
                Итоги матча →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Events log */}
      <div className="bg-gray-900/90 px-4 py-2 max-w-2xl mx-auto w-full">
        {events.slice(0, 2).map((e, i) => (
          <div key={i} className={`text-sm font-semibold py-0.5 ${i === 0 ? "text-white" : "text-gray-500"}`}>
            {e}
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-sm text-gray-500 py-0.5">🎮 Матч начинается...</div>
        )}
      </div>
    </div>
  );
}
