import { useState } from "react";
import { ALL_PLAYERS, Player } from "@/data/players";

interface GalleryProps {
  onBack: () => void;
}

function PlayerDetail({ player, onClose }: { player: Player; onClose: () => void }) {
  const ratingColor = player.rating >= 8 ? "#22c55e" : player.rating >= 6 ? "#f59e0b" : "#ef4444";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-fade-in"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="mb-5">
          <div className="font-black text-3xl" style={{ color: player.color }}>{player.name}</div>
          <div
            className="inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-black text-white"
            style={{ backgroundColor: player.color }}
          >
            {player.role}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-gray-500 font-bold text-sm">Оценка игрока</span>
          <div className="flex items-center gap-3">
            <div className="h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(player.rating / 10) * 100}%`, backgroundColor: ratingColor }}
              />
            </div>
            <span className="font-black text-2xl" style={{ color: ratingColor }}>
              {player.rating}/10
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default function Gallery({ onBack }: GalleryProps) {
  const [selected, setSelected] = useState<Player | null>(null);
  const [filter, setFilter] = useState<string>("Все");

  const roles = ["Все", ...Array.from(new Set(ALL_PLAYERS.map((p) => p.role)))];
  const filtered = filter === "Все" ? ALL_PLAYERS : ALL_PLAYERS.filter((p) => p.role === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur sticky top-0 z-10 px-4 py-3 border-b border-white/50">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="font-black text-xl text-gray-800">ПОКОЛЕНИЕ ЧУДЕС</h1>
            <p className="text-xs text-gray-500 font-semibold">{ALL_PLAYERS.length} игроков</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 max-w-2xl mx-auto scrollbar-hide">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                filter === r
                  ? "bg-purple-500 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((player, i) => {
            const ratingColor = player.rating >= 8 ? "#22c55e" : player.rating >= 6 ? "#f59e0b" : "#ef4444";
            return (
              <div key={player.id} className="slide-in" style={{ animationDelay: `${i * 0.06}s` }}>
                <div
                  onClick={() => setSelected(player)}
                  className="rounded-3xl p-5 cursor-pointer border-4 border-transparent card-float"
                  style={{ backgroundColor: player.bgColor, borderColor: player.color + "40" }}
                >
                  <div className="font-black text-xl leading-tight" style={{ color: player.color }}>
                    {player.name}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold mt-0.5 mb-4">{player.role}</div>

                  <div className="text-xs text-gray-400 font-bold mb-1">Оценка игрока</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/70 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(player.rating / 10) * 100}%`, backgroundColor: ratingColor }}
                      />
                    </div>
                    <span className="font-black text-base" style={{ color: ratingColor }}>
                      {player.rating}/10
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && <PlayerDetail player={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
