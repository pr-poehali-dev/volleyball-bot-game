import CharacterFace from "@/components/CharacterFace";
import { ALL_PLAYERS } from "@/data/players";

interface MainMenuProps {
  onPlay: () => void;
  onGallery: () => void;
  onProfile: () => void;
}

export default function MainMenu({ onPlay, onGallery, onProfile }: MainMenuProps) {
  const decorPlayers = ALL_PLAYERS.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://cdn.poehali.dev/files/11191d08-d3a1-40ba-a82f-22fe7cc28f99.jpg')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1035]/60 via-[#1a1035]/40 to-[#0d0820]/80" />

      {/* Floating players */}
      <div className="absolute bottom-28 left-4 float-anim" style={{ animationDelay: "0s" }}>
        <CharacterFace color={decorPlayers[0].color} face={decorPlayers[0].face} size={52} />
      </div>
      <div className="absolute bottom-36 right-4 float-anim" style={{ animationDelay: "0.8s" }}>
        <CharacterFace color={decorPlayers[1].color} face={decorPlayers[1].face} size={48} />
      </div>
      <div className="absolute bottom-20 left-1/4 float-anim" style={{ animationDelay: "1.4s" }}>
        <CharacterFace color={decorPlayers[2].color} face={decorPlayers[2].face} size={40} />
      </div>
      <div className="absolute bottom-32 right-1/4 float-anim" style={{ animationDelay: "0.4s" }}>
        <CharacterFace color={decorPlayers[3].color} face={decorPlayers[3].face} size={44} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in px-4 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center">
          <div className="text-7xl mb-3 float-anim">🏐</div>
          <h1
            className="font-russo text-4xl leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            style={{
              background: "linear-gradient(135deg, #ffffff, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CheckVolley
          </h1>
          <h2
            className="font-russo text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] -mt-1"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FF6B35)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            3×3
          </h2>
          <p className="text-white/80 font-bold text-sm mt-3 bg-white/10 rounded-full px-4 py-1.5 backdrop-blur border border-white/20">
            🏐 Собери команду из команды ПОКОЛЕНИЕ ЧУДЕС
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={onPlay}
            className="w-full py-4 rounded-3xl font-black text-xl text-white btn-press bounce-hover backdrop-blur-sm border border-white/40 hover:bg-white/20 transition-all"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            🎮 Гужбанить!
          </button>

          <div className="flex gap-3 w-full">
            <button
              onClick={onGallery}
              className="flex-1 py-3 rounded-3xl font-black text-base text-white btn-press bounce-hover backdrop-blur-sm border border-white/40 hover:bg-white/20 transition-all"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              👥 Игроки
            </button>
            <button
              onClick={onProfile}
              className="flex-1 py-3 rounded-3xl font-black text-base text-white btn-press bounce-hover backdrop-blur-sm border border-white/40 hover:bg-white/20 transition-all"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              🏅 Профиль
            </button>
          </div>
        </div>

        {/* Best score badge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-3 border border-white/20 w-full justify-center">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-xs text-white/70 font-bold">Лучший результат</div>
            <div className="text-white font-black text-lg">7 : 2</div>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div>
            <div className="text-xs text-white/70 font-bold">Матчей сыграно</div>
            <div className="text-white font-black text-lg">24</div>
          </div>
        </div>
      </div>
    </div>
  );
}