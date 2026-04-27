import { Player } from "@/data/players";

interface MatchResultsProps {
  myScore: number;
  enemyScore: number;
  team: Player[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function MatchResults({ myScore, enemyScore, team, onPlayAgain, onMainMenu }: MatchResultsProps) {
  const won = myScore > enemyScore;
  const draw = myScore === enemyScore;

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center px-4">
      {/* Result */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4 float-anim">
          {won ? "🏆" : draw ? "🤝" : "😢"}
        </div>
        <h1 className="font-russo text-5xl text-white drop-shadow mb-3">
          {won ? "ПОБЕДА!" : draw ? "НИЧЬЯ!" : "ПОРАЖЕНИЕ"}
        </h1>

        {/* Score */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="flex -space-x-3 justify-center mb-2">
              {team.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="w-10 h-10 rounded-full border-2 border-[#0a1628] flex items-center justify-center text-lg"
                  style={{ backgroundColor: p.color }}
                >
                  {p.face}
                </div>
              ))}
            </div>
            <div className="text-white/60 text-xs font-bold">Моя команда</div>
          </div>

          <div className="bg-white/10 rounded-3xl px-8 py-4 border border-white/20">
            <div className="font-russo text-5xl text-white">
              {myScore} : {enemyScore}
            </div>
          </div>

          <div className="text-center">
            <div className="flex -space-x-3 justify-center mb-2">
              {["😈", "👺", "🤖"].map((f, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#0a1628] flex items-center justify-center text-lg bg-gray-700"
                >
                  {f}
                </div>
              ))}
            </div>
            <div className="text-white/60 text-xs font-bold">Соперники</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-3xl font-black text-xl text-white btn-press"
          style={{
            background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
            boxShadow: "0 8px 0 #c0392b",
          }}
        >
          🔄 Играть снова!
        </button>
        <button
          onClick={onMainMenu}
          className="w-full py-3 rounded-3xl font-black text-base bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-all"
        >
          🏠 Главное меню
        </button>
      </div>
    </div>
  );
}
