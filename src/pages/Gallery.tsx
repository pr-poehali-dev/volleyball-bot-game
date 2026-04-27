import { useState } from "react";
import { ALL_PLAYERS, Player } from "@/data/players";
import CharacterFace from "@/components/CharacterFace";

interface GalleryProps {
  onBack: () => void;
}

function StatCircle({ value, label, color }: { value: number; label: string; color: string }) {
  const pct = (value / 10) * 100;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 52 52" className="w-14 h-14 -rotate-90">
          <circle cx="26" cy="26" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
          <circle
            cx="26" cy="26" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-sm" style={{ color }}>
          {value}
        </div>
      </div>
      <div className="text-xs text-gray-500 font-bold text-center leading-tight">{label}</div>
    </div>
  );
}

function PlayerDetail({ player, onClose }: { player: Player; onClose: () => void }) {
  const total = player.speed + player.reaction + player.power;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-fade-in"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-4 mb-5">
          <CharacterFace color={player.color} face={player.face} size={80} wobble />
          <div>
            <div className="font-black text-2xl" style={{ color: player.color }}>{player.name}</div>
            <div className="text-sm text-gray-500 font-bold">{player.role}</div>
            <div
              className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-black text-white"
              style={{ backgroundColor: player.color }}
            >
              {player.emoji} {player.trait}
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 mb-5 text-sm font-semibold text-gray-600 leading-relaxed"
          style={{ backgroundColor: player.bgColor }}
        >
          {player.description}
        </div>

        <div className="flex justify-around mb-5">
          <StatCircle value={player.speed} label="Скорость" color={player.color} />
          <StatCircle value={player.reaction} label="Реакция" color={player.color} />
          <StatCircle value={player.power} label="Сила" color={player.color} />
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-gray-500 font-bold text-sm">Общий рейтинг</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(total / 30) * 100}%`, backgroundColor: player.color }}
              />
            </div>
            <span className="font-black text-lg" style={{ color: player.color }}>
              {Math.round((total / 30) * 100)}
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
            <p className="text-xs text-gray-500 font-semibold">{ALL_PLAYERS.length} персонажей</p>
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
          {filtered.map((player, i) => (
            <div
              key={player.id}
              className="slide-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div
                onClick={() => setSelected(player)}
                className="rounded-3xl p-4 cursor-pointer border-4 border-transparent hover:border-opacity-50 card-float text-center"
                style={{
                  backgroundColor: player.bgColor,
                  borderColor: player.color + "40",
                }}
              >
                <div className="text-4xl mb-1">{player.emoji}</div>
                <div className="text-4xl float-anim" style={{ animationDelay: `${i * 0.3}s` }}>
                  {player.face}
                </div>
                <div className="font-black text-base mt-2 leading-tight" style={{ color: player.color }}>
                  {player.name}
                </div>
                <div className="text-xs text-gray-500 font-semibold mb-2">{player.role}</div>

                <div
                  className="text-xs font-black rounded-full px-2 py-0.5 inline-block text-white mb-3"
                  style={{ backgroundColor: player.color }}
                >
                  {player.trait}
                </div>

                <div className="flex justify-around text-center">
                  {[
                    { label: "💨", val: player.speed },
                    { label: "⚡", val: player.reaction },
                    { label: "💪", val: player.power },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <div className="text-sm">{label}</div>
                      <div className="font-black text-sm" style={{ color: player.color }}>{val}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs text-gray-400 font-semibold">
                  Нажми для деталей →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <PlayerDetail player={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}