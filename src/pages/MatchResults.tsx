import { Player } from "@/data/players";
import CharacterFace from "@/components/CharacterFace";

interface MatchResultsProps {
  myScore: number;
  enemyScore: number;
  team: Player[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

function StatRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 font-semibold text-sm">{label}</span>
      <span className="font-black" style={{ color }}>{value}</span>
    </div>
  );
}

export default function MatchResults({ myScore, enemyScore, team, onPlayAgain, onMainMenu }: MatchResultsProps) {
  const won = myScore > enemyScore;
  const draw = myScore === enemyScore;

  const mvp = team.reduce((best, p) =>
    (p.speed + p.reaction + p.power) > (best.speed + best.reaction + best.power) ? p : best
  );

  const topScorer = team[Math.floor(Math.random() * team.length)];
  const goals = Math.floor(Math.random() * (myScore + 1));
  const assists = myScore - goals;
  const shots = myScore + Math.floor(Math.random() * 6);
  const possession = 45 + Math.floor(Math.random() * 20);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100 flex flex-col">
      {/* Result header */}
      <div
        className="px-4 py-10 text-center"
        style={{
          background: won
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : draw
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : "linear-gradient(135deg, #ef4444, #dc2626)",
        }}
      >
        <div className="text-6xl mb-2 float-anim">
          {won ? "🏆" : draw ? "🤝" : "😢"}
        </div>
        <h1 className="font-russo text-4xl text-white drop-shadow mb-2">
          {won ? "ПОБЕДА!" : draw ? "НИЧЬЯ!" : "ПОРАЖЕНИЕ"}
        </h1>

        {/* Score */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="flex -space-x-3 justify-center mb-1">
              {team.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-base"
                  style={{ backgroundColor: p.color }}
                >
                  {p.face}
                </div>
              ))}
            </div>
            <div className="text-white/80 text-xs font-bold">Моя команда</div>
          </div>

          <div className="bg-white/20 rounded-3xl px-8 py-4 backdrop-blur">
            <div className="font-russo text-5xl text-white">
              {myScore} : {enemyScore}
            </div>
          </div>

          <div className="text-center">
            <div className="flex -space-x-3 justify-center mb-1">
              {["😈", "👺", "🤖"].map((f, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-base bg-gray-700"
                >
                  {f}
                </div>
              ))}
            </div>
            <div className="text-white/80 text-xs font-bold">Соперники</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-4">
        {/* MVP */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-yellow-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <h2 className="font-black text-lg text-gray-800">Лучший игрок матча</h2>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <CharacterFace color={mvp.color} face={mvp.face} size={60} wobble />
            <div>
              <div className="font-black text-xl" style={{ color: mvp.color }}>{mvp.name}</div>
              <div className="text-sm text-gray-500 font-semibold">{mvp.role}</div>
              <div className="mt-1 inline-block bg-yellow-100 text-yellow-700 rounded-full px-3 py-0.5 text-xs font-bold">
                ✨ {mvp.trait}
              </div>
            </div>
          </div>
        </div>

        {/* Match stats */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📊</span>
            <h2 className="font-black text-lg text-gray-800">Статистика матча</h2>
          </div>
          <StatRow label="⚽ Голы" value={myScore} color="#22c55e" />
          <StatRow label="🎯 Удары" value={shots} color="#3b82f6" />
          <StatRow label="🅰️ Передачи" value={assists} color="#f59e0b" />
          <StatRow label="⏱️ Владение мячом" value={`${possession}%`} color="#8b5cf6" />
        </div>

        {/* Top scorer */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👟</span>
            <h2 className="font-black text-lg text-gray-800">Лучший бомбардир</h2>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2"
              style={{ backgroundColor: topScorer.bgColor, borderColor: topScorer.color }}
            >
              {topScorer.face}
            </div>
            <div className="flex-1">
              <div className="font-black" style={{ color: topScorer.color }}>{topScorer.name}</div>
              <div className="text-sm text-gray-500">{goals} гол{goals === 1 ? "" : goals < 5 ? "а" : "ов"}</div>
            </div>
            <div className="text-3xl font-black text-gray-200">{goals}</div>
          </div>
        </div>

        {/* Team performance */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👥</span>
            <h2 className="font-black text-lg text-gray-800">Оценки команды</h2>
          </div>
          <div className="space-y-2">
            {team.map((p) => {
              const rating = Math.max(4, Math.min(10, Math.round((p.speed + p.reaction + p.power) / 3 + (Math.random() * 2 - 1))));
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ backgroundColor: p.bgColor }}
                  >
                    {p.face}
                  </div>
                  <span className="flex-1 text-sm font-bold text-gray-700 truncate">{p.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-4 rounded-sm"
                        style={{ backgroundColor: i < rating ? p.color : "#e5e7eb" }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-black w-5 text-right" style={{ color: p.color }}>{rating}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-8 max-w-2xl mx-auto w-full flex flex-col gap-3">
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
          className="w-full py-3 rounded-3xl font-black text-base bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 transition-all"
        >
          🏠 Главное меню
        </button>
      </div>
    </div>
  );
}
