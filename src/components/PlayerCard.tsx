import { Player } from "@/data/players";

interface PlayerCardProps {
  player: Player;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function PlayerCard({ player, selected, onClick, size = "md" }: PlayerCardProps) {
  const sizeMap = {
    sm: { card: "p-3", name: "text-sm" },
    md: { card: "p-4", name: "text-base" },
    lg: { card: "p-6", name: "text-xl" },
  };
  const s = sizeMap[size];

  const ratingColor = player.rating >= 8 ? "#22c55e" : player.rating >= 6 ? "#f59e0b" : "#ef4444";

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

      <div className="text-center">
        <div
          className={`font-black ${s.name} leading-tight`}
          style={{ color: player.color }}
        >
          {player.name}
        </div>
        <div className="text-xs text-gray-500 font-semibold mt-1 bg-white/60 rounded-full px-2 py-0.5 inline-block">
          {player.role}
        </div>

        <div className="mt-3 bg-white/70 rounded-2xl px-3 py-2">
          <div className="text-xs text-gray-400 font-bold mb-1">Оценка игрока</div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(player.rating / 10) * 100}%`, backgroundColor: ratingColor }}
              />
            </div>
            <span className="font-black text-base" style={{ color: ratingColor }}>
              {player.rating}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
