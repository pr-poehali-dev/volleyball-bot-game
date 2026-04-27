import { Player } from "@/data/players";

interface PlayerCardProps {
  player: Player;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showStats?: boolean;
}

function StatBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-4 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default function PlayerCard({ player, selected, onClick, size = "md", showStats = false }: PlayerCardProps) {
  const sizeMap = {
    sm: { card: "p-3", face: "text-4xl", name: "text-sm", emoji: "text-lg" },
    md: { card: "p-4", face: "text-5xl", name: "text-base", emoji: "text-xl" },
    lg: { card: "p-6", face: "text-7xl", name: "text-xl", emoji: "text-2xl" },
  };
  const s = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-3xl cursor-pointer transition-all duration-200 border-4
        ${s.card}
        ${selected
          ? "border-green-500 scale-105 shadow-xl shadow-green-200"
          : "border-transparent hover:border-gray-200 hover:shadow-lg"
        }
        ${onClick ? "card-float" : ""}
      `}
      style={{ backgroundColor: player.bgColor }}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md z-10">
          ✓
        </div>
      )}

      <div className="text-center mb-2">
        <div className={`${s.emoji} mb-1`}>{player.emoji}</div>
        <div className={`${s.face} float-anim`}>{player.face}</div>
        <div
          className={`font-black ${s.name} mt-2 leading-tight`}
          style={{ color: player.color }}
        >
          {player.name}
        </div>
        <div className="text-xs text-gray-500 font-semibold mt-0.5 bg-white/60 rounded-full px-2 py-0.5 inline-block">
          {player.role}
        </div>
      </div>

      {showStats && (
        <div className="mt-3 space-y-1.5">
          <div>
            <div className="text-xs text-gray-500 font-bold mb-0.5">Скорость</div>
            <StatBar value={player.speed} color={player.color} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-0.5">Реакция</div>
            <StatBar value={player.reaction} color={player.color} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold mb-0.5">Сила</div>
            <StatBar value={player.power} color={player.color} />
          </div>
          <div className="mt-2 text-xs bg-white/70 rounded-2xl px-3 py-2 text-gray-600 font-semibold text-center">
            ✨ {player.trait}
          </div>
        </div>
      )}
    </div>
  );
}
