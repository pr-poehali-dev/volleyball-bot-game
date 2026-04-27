import { ACHIEVEMENTS, ALL_PLAYERS } from "@/data/players";
import CharacterFace from "@/components/CharacterFace";

interface ProfileProps {
  onBack: () => void;
}

const STATS = [
  { label: "Матчей сыграно", value: 24, icon: "🎮", color: "#6366f1" },
  { label: "Побед", value: 15, icon: "🏆", color: "#22c55e" },
  { label: "Ничьих", value: 4, icon: "🤝", color: "#f59e0b" },
  { label: "Поражений", value: 5, icon: "😢", color: "#ef4444" },
  { label: "Голов забито", value: 87, icon: "⚽", color: "#3b82f6" },
  { label: "Голов пропущено", value: 43, icon: "🧤", color: "#8b5cf6" },
];

const HISTORY = [
  { result: "win", score: "3:1", opponent: "Злодеи", date: "Вчера" },
  { result: "win", score: "5:2", opponent: "Монстры", date: "2 дня назад" },
  { result: "loss", score: "1:4", opponent: "Роботы", date: "3 дня назад" },
  { result: "draw", score: "2:2", opponent: "Зомби", date: "5 дней назад" },
  { result: "win", score: "7:1", opponent: "Злюки", date: "Неделю назад" },
];

export default function Profile({ onBack }: ProfileProps) {
  const winRate = Math.round((15 / 24) * 100);
  const favoritePlayer = ALL_PLAYERS[1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur sticky top-0 z-10 px-4 py-3 border-b border-white/50">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-all"
          >
            ←
          </button>
          <h1 className="font-black text-xl text-gray-800">Мой профиль</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 max-w-2xl mx-auto w-full">
        {/* Profile card */}
        <div
          className="rounded-3xl p-6 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #FFB627, #FF6B6B)" }}
        >
          <div className="absolute -top-4 -right-4 text-8xl opacity-20">⭐</div>
          <div className="absolute -bottom-4 -left-4 text-8xl opacity-20">🏆</div>

          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/30 mx-auto flex items-center justify-center text-5xl mb-3 border-4 border-white/50 float-anim">
              😎
            </div>
            <h2 className="font-russo text-2xl text-white drop-shadow">Капитан Максим</h2>
            <div className="text-white/80 text-sm font-semibold">Легенда лиги</div>

            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                <div className="font-black text-2xl text-white">{winRate}%</div>
                <div className="text-white/80 text-xs font-bold">Побед</div>
              </div>
              <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                <div className="font-black text-2xl text-white">24</div>
                <div className="text-white/80 text-xs font-bold">Матчей</div>
              </div>
              <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
                <div className="font-black text-2xl text-white">🥇</div>
                <div className="text-white/80 text-xs font-bold">Ранг</div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite player */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">❤️</span>
            <h2 className="font-black text-lg text-gray-800">Любимый игрок</h2>
          </div>
          <div className="flex items-center gap-4">
            <CharacterFace color={favoritePlayer.color} face={favoritePlayer.face} size={60} wobble />
            <div className="flex-1">
              <div className="font-black text-xl" style={{ color: favoritePlayer.color }}>{favoritePlayer.name}</div>
              <div className="text-sm text-gray-500">{favoritePlayer.role} · {favoritePlayer.trait}</div>
              <div className="text-xs text-gray-400 mt-1">Выбирался 18 раз</div>
            </div>
            <div className="text-4xl">{favoritePlayer.emoji}</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📊</span>
            <h2 className="font-black text-lg text-gray-800">Статистика</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: s.color + "15" }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-2xl" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500 font-semibold leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🏅</span>
            <h2 className="font-black text-lg text-gray-800">Достижения</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a, i) => {
              const unlocked = i < 4;
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl p-3 text-center border-2 transition-all ${
                    unlocked
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-100 bg-gray-50 opacity-50 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-1">{a.icon}</div>
                  <div className={`text-xs font-black leading-tight ${unlocked ? "text-yellow-700" : "text-gray-400"}`}>
                    {a.name}
                  </div>
                  {unlocked && (
                    <div className="text-xs text-yellow-500 font-bold mt-0.5">✓ Получено</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Match history */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📅</span>
            <h2 className="font-black text-lg text-gray-800">История матчей</h2>
          </div>
          <div className="space-y-2">
            {HISTORY.map((h, i) => {
              const cfg = {
                win: { bg: "#dcfce7", text: "#16a34a", label: "ПОБЕДА", icon: "🏆" },
                loss: { bg: "#fee2e2", text: "#dc2626", label: "ПОРАЖЕНИЕ", icon: "😢" },
                draw: { bg: "#fef9c3", text: "#ca8a04", label: "НИЧЬЯ", icon: "🤝" },
              }[h.result];

              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div
                    className="rounded-xl px-2 py-1 text-xs font-black min-w-20 text-center"
                    style={{ backgroundColor: cfg.bg, color: cfg.text }}
                  >
                    {cfg.icon} {cfg.label}
                  </div>
                  <div className="font-black text-gray-800 text-base">{h.score}</div>
                  <div className="flex-1 text-sm text-gray-500 font-semibold">vs {h.opponent}</div>
                  <div className="text-xs text-gray-400">{h.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
