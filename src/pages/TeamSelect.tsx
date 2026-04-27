import { useState } from "react";
import { ALL_PLAYERS, Player } from "@/data/players";
import PlayerCard from "@/components/PlayerCard";

interface TeamSelectProps {
  onBack: () => void;
  onStartGame: (team: Player[]) => void;
}

const TEAM_SIZE = 3;

function getRoleWarning(selected: number[]): string | null {
  const team = ALL_PLAYERS.filter((p) => selected.includes(p.id));
  const cbCount = team.filter((p) => p.role === "ЦБ").length;
  if (cbCount > 1) return "В составе 3x3 может быть только 1 ЦБ";
  return null;
}

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
  const warning = getRoleWarning(selected);

  const cbPlayers = ALL_PLAYERS.filter((p) => p.role === "ЦБ");
  const otherPlayers = ALL_PLAYERS.filter((p) => p.role !== "ЦБ");

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
            <h1 className="font-black text-xl text-gray-800">Выбери состав 3×3</h1>
            <p className="text-sm text-gray-500 font-semibold">
              Выбрано: {selected.length} / {TEAM_SIZE} игроков
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
            Вперёд! 🏐
          </button>
        </div>
      </div>

      {/* Slots */}
      <div className="px-4 pt-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-3 mb-3">
          {Array.from({ length: TEAM_SIZE }).map((_, i) => {
            const player = team[i];
            return (
              <div
                key={i}
                className="flex-1 h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 gap-0.5"
                style={{
                  backgroundColor: player ? player.bgColor : "rgba(255,255,255,0.5)",
                  borderColor: player ? player.color : "#cbd5e1",
                }}
              >
                {player ? (
                  <>
                    <span className="text-xl">{player.face}</span>
                    <span className="text-xs font-black truncate px-1" style={{ color: player.color }}>
                      {player.name}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">{player.role}</span>
                  </>
                ) : (
                  <span className="text-gray-300 text-2xl">?</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Block message */}
        {blockMsg && (
          <div className="bg-red-100 border border-red-300 rounded-2xl px-4 py-2 text-center text-red-600 font-bold text-sm mb-3 animate-bounce-in">
            ⛔ {blockMsg}
          </div>
        )}

        {warning && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-2xl px-4 py-2 text-center text-yellow-700 font-bold text-sm mb-3">
            ⚠️ {warning}
          </div>
        )}

        {canStart && (
          <div className="bg-green-100 border border-green-300 rounded-2xl px-4 py-2 text-center text-green-700 font-bold text-sm mb-3 animate-bounce-in">
            🎉 Состав готов! Нажми «Вперёд!»
          </div>
        )}
      </div>

      {/* Players list */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 max-w-2xl mx-auto w-full space-y-4">

        {/* ЦБ section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-black text-gray-400 px-2">
              ЦБ — Центральный блокирующий
              {selected.filter((id) => ALL_PLAYERS.find((p) => p.id === id)?.role === "ЦБ").length > 0
                ? " · только 1 в составе"
                : ""}
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {cbPlayers.map((player) => {
              const { ok } = canSelect(player.id, selected);
              const isSelected = selected.includes(player.id);
              const isBlocked = !ok && !isSelected;
              return (
                <div key={player.id} className="slide-in" style={{ animationDelay: `${player.id * 0.05}s` }}>
                  <div className={isBlocked ? "opacity-40 grayscale pointer-events-none" : ""}>
                    <PlayerCard
                      player={player}
                      selected={isSelected}
                      onClick={() => toggle(player.id)}
                      size="md"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other roles */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-black text-gray-400 px-2">Остальные позиции</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {otherPlayers.map((player) => {
              const { ok } = canSelect(player.id, selected);
              const isSelected = selected.includes(player.id);
              const isBlocked = !ok && !isSelected;
              return (
                <div key={player.id} className="slide-in" style={{ animationDelay: `${player.id * 0.05}s` }}>
                  <div className={isBlocked ? "opacity-40 grayscale pointer-events-none" : ""}>
                    <PlayerCard
                      player={player}
                      selected={isSelected}
                      onClick={() => toggle(player.id)}
                      size="md"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}