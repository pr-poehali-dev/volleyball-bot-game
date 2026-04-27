import { useState } from "react";
import { ALL_PLAYERS, Player } from "@/data/players";
import PlayerCard from "@/components/PlayerCard";

interface TeamSelectProps {
  onBack: () => void;
  onStartGame: (team: Player[]) => void;
}

export default function TeamSelect({ onBack, onStartGame }: TeamSelectProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 6
          ? [...prev, id]
          : prev
    );
  };

  const canStart = selected.length === 6;
  const team = ALL_PLAYERS.filter((p) => selected.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur sticky top-0 z-20 px-4 py-3 border-b border-white/50">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 transition-all"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-gray-800">Выбери команду</h1>
            <p className="text-sm text-gray-500 font-semibold">
              Выбрано: {selected.length} / 6 игроков
            </p>
          </div>
          <button
            onClick={() => canStart && onStartGame(team)}
            disabled={!canStart}
            className={`px-5 py-2 rounded-2xl font-black text-base transition-all duration-200 ${
              canStart
                ? "bg-green-500 text-white btn-press shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Вперёд! ⚽
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, i) => {
            const player = team[i];
            return (
              <div
                key={i}
                className="flex-1 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: player ? player.bgColor : "rgba(255,255,255,0.5)",
                  borderColor: player ? player.color : "#cbd5e1",
                }}
              >
                {player ? (
                  <span className="text-xl">{player.face}</span>
                ) : (
                  <span className="text-gray-300 text-xl">?</span>
                )}
              </div>
            );
          })}
        </div>

        {canStart && (
          <div className="bg-green-100 border border-green-300 rounded-2xl px-4 py-2 text-center text-green-700 font-bold text-sm mb-4 animate-bounce-in">
            🎉 Команда готова! Нажми «Вперёд!»
          </div>
        )}
      </div>

      {/* Players grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-2 gap-3">
          {ALL_PLAYERS.map((player) => (
            <div key={player.id} className="slide-in" style={{ animationDelay: `${player.id * 0.05}s` }}>
              <PlayerCard
                player={player}
                selected={selected.includes(player.id)}
                onClick={() => toggle(player.id)}
                size="md"
                showStats
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
