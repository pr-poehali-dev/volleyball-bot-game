import CharacterFace from "@/components/CharacterFace";
import { ALL_PLAYERS } from "@/data/players";

interface MainMenuProps {
  onPlay: () => void;
  onGallery: () => void;
  onProfile: () => void;
}

export default function MainMenu({ onPlay, onGallery, onProfile }: MainMenuProps) {
  const decorPlayers = ALL_PLAYERS.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-green-400">
      {/* Clouds */}
      <div className="absolute top-8 left-8 w-24 h-10 bg-white rounded-full opacity-80 blur-sm" />
      <div className="absolute top-12 left-16 w-16 h-8 bg-white rounded-full opacity-80 blur-sm" />
      <div className="absolute top-6 right-12 w-28 h-10 bg-white rounded-full opacity-80 blur-sm" />
      <div className="absolute top-14 right-20 w-16 h-7 bg-white rounded-full opacity-80 blur-sm" />
      <div className="absolute top-20 left-1/3 w-20 h-8 bg-white rounded-full opacity-60 blur-sm" />

      {/* Stars decoration */}
      <div className="absolute top-24 left-6 text-yellow-300 text-2xl star-spin">⭐</div>
      <div className="absolute top-32 right-8 text-yellow-300 text-xl star-spin" style={{ animationDelay: "1.5s" }}>✨</div>
      <div className="absolute top-16 left-1/4 text-yellow-200 text-lg star-spin" style={{ animationDelay: "0.7s" }}>🌟</div>

      {/* Floating players */}
      <div className="absolute bottom-24 left-4 float-anim" style={{ animationDelay: "0s" }}>
        <CharacterFace color={decorPlayers[0].color} face={decorPlayers[0].face} size={56} />
      </div>
      <div className="absolute bottom-32 right-4 float-anim" style={{ animationDelay: "0.8s" }}>
        <CharacterFace color={decorPlayers[1].color} face={decorPlayers[1].face} size={52} />
      </div>
      <div className="absolute bottom-16 left-1/4 float-anim" style={{ animationDelay: "1.4s" }}>
        <CharacterFace color={decorPlayers[2].color} face={decorPlayers[2].face} size={44} />
      </div>
      <div className="absolute bottom-28 right-1/4 float-anim" style={{ animationDelay: "0.4s" }}>
        <CharacterFace color={decorPlayers[3].color} face={decorPlayers[3].face} size={48} />
      </div>

      {/* Football field ground */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-green-500 rounded-t-[50%]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="text-7xl mb-2 float-anim">⚽</div>
          <h1 className="font-russo text-5xl text-white drop-shadow-[0_4px_0px_rgba(0,0,0,0.25)] leading-tight">
            ФУТБОЛ
          </h1>
          <h2 className="font-russo text-3xl text-yellow-300 drop-shadow-[0_3px_0px_rgba(0,0,0,0.2)] -mt-1">
            МЕЧТЫ
          </h2>
          <p className="text-white/90 font-bold text-sm mt-2 bg-white/20 rounded-full px-4 py-1 backdrop-blur">
            Собери команду и побеждай! 🏆
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <button
            onClick={onPlay}
            className="w-full py-4 rounded-3xl font-black text-xl text-white btn-press bounce-hover"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
              boxShadow: "0 8px 0 #c0392b",
            }}
          >
            🎮 Играть!
          </button>

          <div className="flex gap-3 w-full">
            <button
              onClick={onGallery}
              className="flex-1 py-3 rounded-3xl font-black text-base text-white btn-press bounce-hover"
              style={{
                background: "linear-gradient(135deg, #A29BFE, #6C5CE7)",
                boxShadow: "0 6px 0 #4834d4",
              }}
            >
              👥 Герои
            </button>
            <button
              onClick={onProfile}
              className="flex-1 py-3 rounded-3xl font-black text-base text-white btn-press bounce-hover"
              style={{
                background: "linear-gradient(135deg, #FFB627, #FD9644)",
                boxShadow: "0 6px 0 #e67e22",
              }}
            >
              🏅 Профиль
            </button>
          </div>
        </div>

        {/* Best score badge */}
        <div className="bg-white/30 backdrop-blur rounded-2xl px-6 py-3 flex items-center gap-3 border border-white/50">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-xs text-white/80 font-bold">Лучший результат</div>
            <div className="text-white font-black text-lg">7 : 2</div>
          </div>
          <div className="w-px h-8 bg-white/40" />
          <div>
            <div className="text-xs text-white/80 font-bold">Матчей сыграно</div>
            <div className="text-white font-black text-lg">24</div>
          </div>
        </div>
      </div>
    </div>
  );
}
