interface MainMenuProps {
  onPlay: () => void;
  onGallery: () => void;
  onProfile: () => void;
}

export default function MainMenu({ onPlay, onGallery, onProfile }: MainMenuProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-pan"
        style={{ backgroundImage: "url('https://cdn.poehali.dev/files/11191d08-d3a1-40ba-a82f-22fe7cc28f99.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1035]/60 via-[#1a1035]/40 to-[#0d0820]/80" />

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
      </div>
    </div>
  );
}