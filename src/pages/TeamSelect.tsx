import { useState } from "react";
import { ALL_PLAYERS, Player } from "@/data/players";

interface TeamSelectProps {
  onBack: () => void;
  onStartGame: (team: Player[]) => void;
}

const TEAM_SIZE = 3;

function canSelect(id: number, selected: number[]): { ok: boolean; reason?: string } {
  if (selected.includes(id)) return { ok: true };
  if (selected.length >= TEAM_SIZE) return { ok: false, reason: "Уже выбрано 3 игрока" };
  const player = ALL_PLAYERS.find((p) => p.id === id)!;
  if (player.role === "ЦБ") {
    const currentTeam = ALL_PLAYERS.filter((p) => selected.includes(p.id));
    const hasCB = currentTeam.some((p) => p.role === "ЦБ");
    if (hasCB) return { ok: false, reason: "В составе уже есть ЦБ — в 3x3 только один!" };
  }
  return { ok: true };
}

const ROLE_COLORS: Record<string, string> = {
  ЦБ: "#ef4444",
  Связ: "#3b82f6",
  Диаг: "#f59e0b",
  Доигр: "#22c55e",
};

export default function TeamSelect({ onBack, onStartGame }: TeamSelectProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [blockMsg, setBlockMsg] = useState<string | null>(null);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      setSelected((prev) => prev.filter((x) => x !== id));
      setBlockMsg(null);
      return;
    }
    const { ok, reason } = canSelect(id, selected);
    if (!ok) {
      setBlockMsg(reason ?? null);
      setTimeout(() => setBlockMsg(null), 2500);
      return;
    }
    setBlockMsg(null);
    setSelected((prev) => [...prev, id]);
  };

  const canStart = selected.length === TEAM_SIZE;
  const team = ALL_PLAYERS.filter((p) => selected.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      {/* Header */}
      <div className="bg-[#0d1e3a] sticky top-0 z-20 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white hover:bg-white/20 transition-all"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="font-black text-xl text-white">Состав</h1>
            <p className="text-sm text-white/50 font-semibold">
              Выбрано: {selected.length} / {TEAM_SIZE}
            </p>
          </div>
          <button
            onClick={() => canStart && onStartGame(team)}
            disabled={!canStart}
            className={`px-5 py-2 rounded-2xl font-black text-base transition-all duration-200 ${
              canStart
                ? "bg-green-500 text-white btn-press shadow-lg"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            Гужбанить! 🏐
          </button>
        </div>
      </div>

      {/* Selected slots */}
      <div className="px-4 pt-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-3 mb-3">
          {Array.from({ length: TEAM_SIZE }).map((_, i) => {
            const player = team[i];
            return (
              <div
                key={i}
                className="flex-1 h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-0.5 transition-all duration-300"
                style={{
                  backgroundColor: player ? `${player.color}22` : "rgba(255,255,255,0.05)",
                  borderColor: player ? player.color : "rgba(255,255,255,0.2)",
                }}
              >
                {player ? (
                  <>
                    <span className="text-xl">{player.face}</span>
                    <span className="text-xs font-black truncate px-1" style={{ color: player.color }}>
                      {player.name}
                    </span>
                  </>
                ) : (
                  <span className="text-white/20 text-2xl">?</span>
                )}
              </div>
            );
          })}
        </div>

        {blockMsg && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-2xl px-4 py-2 text-center text-red-300 font-bold text-sm mb-3">
            ⛔ {blockMsg}
          </div>
        )}

        {canStart && (
          <div className="bg-green-900/50 border border-green-500/50 rounded-2xl px-4 py-2 text-center text-green-300 font-bold text-sm mb-3">
            🎉 Состав готов! Нажми «Гужбанить!»
          </div>
        )}
      </div>

      {/* Players list — rows */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 max-w-2xl mx-auto w-full space-y-2 mt-1">
        {ALL_PLAYERS.map((player) => {
          const { ok } = canSelect(player.id, selected);
          const isSelected = selected.includes(player.id);
          const isBlocked = !ok && !isSelected;
          const roleColor = ROLE_COLORS[player.role] ?? "#8b5cf6";

          return (
            <div
              key={player.id}
              onClick={() => !isBlocked && toggle(player.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                isBlocked ? "opacity-30 pointer-events-none" : "active:scale-95"
              }`}
              style={{
                backgroundColor: isSelected ? `${player.color}22` : "rgba(255,255,255,0.05)",
                borderColor: isSelected ? player.color : "rgba(255,255,255,0.1)",
              }}
            >
              {/* Аватар */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2"
                style={{ backgroundColor: `${player.color}33`, borderColor: `${player.color}55` }}
              >
                {player.face}
              </div>

              {/* Имя + роль */}
              <div className="flex-1 min-w-0">
                <div className="font-black text-base text-white truncate">{player.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${roleColor}33`, color: roleColor }}
                  >
                    {player.role}
                  </span>
                  <span className="text-xs text-white/40">{player.description}</span>
                </div>
              </div>

              {/* Рейтинг + галочка */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-black" style={{ color: player.rating >= 7 ? "#22c55e" : player.rating >= 5 ? "#f59e0b" : "#ef4444" }}>
                  {player.rating}/10
                </span>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
