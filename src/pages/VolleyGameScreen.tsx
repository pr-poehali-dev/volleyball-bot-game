import { useState, useEffect, useRef, useCallback } from "react";
import { Player } from "@/data/players";
import CharacterFace from "@/components/CharacterFace";

interface VolleyGameScreenProps {
  team: Player[];
  onEndGame: (result: { myScore: number; enemyScore: number; team: Player[] }) => void;
}

type Phase = "serve-anim" | "waiting" | "ai-turn" | "gameover";
type Side = "player" | "ai";

const ENEMY_PLAYERS = [
  { color: "#E74C3C", face: "😈", name: "Злодей" },
  { color: "#8E44AD", face: "👺", name: "Монстр" },
  { color: "#2C3E50", face: "🤖", name: "Робот" },
];

// Начальные позиции игроков (в % от поля)
const INITIAL_POSITIONS = [
  { x: 20, y: 25 },
  { x: 20, y: 50 },
  { x: 20, y: 75 },
];

const WIN_SCORE = 7;
const TIME_LIMIT = 60;

export default function VolleyGameScreen({ team, onEndGame }: VolleyGameScreenProps) {
  const [myScore, setMyScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [phase, setPhase] = useState<Phase>("serve-anim");
  const [touches, setTouches] = useState(0);
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);
  const [ballSide, setBallSide] = useState<Side>("player");
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null);
  const [serveAnim, setServeAnim] = useState(false);
  const [activePIdx, setActivePIdx] = useState<number | null>(null);

  // Позиции игроков (перетаскивание)
  const [playerPos, setPlayerPos] = useState(INITIAL_POSITIONS.map((p) => ({ ...p })));
  const draggingRef = useRef<{ idx: number; offsetX: number; offsetY: number } | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = useCallback((text: string, color: string, duration = 1600) => {
    setMsg({ text, color });
    setTimeout(() => setMsg(null), duration);
  }, []);

  const startServeAnim = useCallback((side: Side) => {
    setPhase("serve-anim");
    setServeAnim(true);
    setBallX(side === "player" ? 18 : 82);
    setBallY(50);
    showMsg(side === "player" ? "Ваша подача! 🏐" : "Подача противника 😈", side === "player" ? "#3b82f6" : "#ef4444", 1000);

    setTimeout(() => {
      setServeAnim(false);
      const targetX = side === "player" ? 72 : 28;
      const targetY = 30 + Math.random() * 40;
      setBallX(targetX);
      setBallY(targetY);
      setBallSide(side === "player" ? "ai" : "player");
      setTouches(0);
      setPhase(side === "player" ? "ai-turn" : "waiting");
    }, 900);
  }, [showMsg]);

  // Таймер
  useEffect(() => {
    if (phase === "gameover") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("gameover");
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase === "gameover"]);

  // Победа по очкам
  useEffect(() => {
    if (myScore >= WIN_SCORE || enemyScore >= WIN_SCORE) {
      setPhase("gameover");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [myScore, enemyScore]);

  // Старт
  useEffect(() => { startServeAnim("player"); }, []);

  // ИИ логика
  useEffect(() => {
    if (phase !== "ai-turn") return;
    aiTimerRef.current = setTimeout(() => {
      const rnd = Math.random();
      if (rnd < 0.30) {
        showMsg("📵 Ошибка противника! +1 вам", "#22c55e");
        setMyScore((s) => s + 1);
        setTimeout(() => startServeAnim("player"), 1200);
        return;
      }
      setActivePIdx(Math.floor(Math.random() * ENEMY_PLAYERS.length));
      setTimeout(() => setActivePIdx(null), 400);
      setBallX(18 + Math.random() * 28);
      setBallY(25 + Math.random() * 50);
      setBallSide("player");
      setTouches(0);
      setPhase("waiting");
      showMsg("Мяч на вашей стороне!", "#8b5cf6", 900);
    }, 800 + Math.random() * 500);
    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [phase, showMsg, startServeAnim]);

  // --- Перетаскивание игроков ---
  const getFieldCoords = useCallback((clientX: number, clientY: number) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.max(2, Math.min(48, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const handlePlayerMouseDown = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (playerPos[idx].x / 100) * rect.width + rect.left;
    const py = (playerPos[idx].y / 100) * rect.height + rect.top;
    draggingRef.current = { idx, offsetX: e.clientX - px, offsetY: e.clientY - py };
  };

  const handlePlayerTouchStart = (e: React.TouchEvent, idx: number) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const px = (playerPos[idx].x / 100) * rect.width + rect.left;
    const py = (playerPos[idx].y / 100) * rect.height + rect.top;
    draggingRef.current = { idx, offsetX: touch.clientX - px, offsetY: touch.clientY - py };
  };

  const handleFieldMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const coords = getFieldCoords(e.clientX - draggingRef.current.offsetX, e.clientY - draggingRef.current.offsetY);
    if (!coords) return;
    const idx = draggingRef.current.idx;
    setPlayerPos((prev) => prev.map((p, i) => i === idx ? coords : p));
  }, [getFieldCoords]);

  const handleFieldTouchMove = useCallback((e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getFieldCoords(touch.clientX - draggingRef.current.offsetX, touch.clientY - draggingRef.current.offsetY);
    if (!coords) return;
    const idx = draggingRef.current.idx;
    setPlayerPos((prev) => prev.map((p, i) => i === idx ? coords : p));
  }, [getFieldCoords]);

  const stopDrag = useCallback(() => {
    draggingRef.current = null;
  }, []);

  // Удар по мячу — свайп/клик поля (только своя половина)
  const fieldTouchStartRef = useRef({ x: 0, y: 0 });

  const handleFieldTouchStartGame = (e: React.TouchEvent) => {
    // Если начали с игрока — пропускаем
    if (draggingRef.current) return;
    fieldTouchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleFieldTouchEndGame = useCallback((e: React.TouchEvent) => {
    if (draggingRef.current) { draggingRef.current = null; return; }
    if (phase !== "waiting") return;
    const dx = e.changedTouches[0].clientX - fieldTouchStartRef.current.x;
    processHit(dx);
  }, [phase, touches]);

  const handleFieldClick = useCallback((e: React.MouseEvent) => {
    if (draggingRef.current) return;
    if (phase !== "waiting") return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width * 0.25; // клик правее центра левой половины
    processHit(dx);
  }, [phase, touches]);

  const processHit = useCallback((dx: number) => {
    if (phase !== "waiting") return;
    const newTouches = touches + 1;
    const pIdx = Math.floor(Math.random() * team.length);
    setActivePIdx(pIdx);
    setTimeout(() => setActivePIdx(null), 500);

    const isAttack = dx > 15 || Math.abs(dx) <= 15;

    if (newTouches >= 3 && !isAttack) {
      showMsg("🚫 3 касания! Очко противнику", "#ef4444");
      setEnemyScore((s) => s + 1);
      setTouches(0);
      setTimeout(() => startServeAnim("ai"), 1200);
      return;
    }

    if (isAttack) {
      const power = Math.min(Math.abs(dx) / 80, 1);
      setBallX(58 + power * 28);
      setBallY(20 + Math.random() * 60);
      setBallSide("ai");
      setTouches(0);

      const msgs = [
        `${team[pIdx].name}: пас! 🏐`,
        `${team[pIdx].name}: атака! 💥`,
        `${team[pIdx].name}: удар! ⚡`,
      ];
      showMsg(msgs[Math.min(newTouches - 1, 2)], ["#3b82f6", "#f59e0b", "#22c55e"][Math.min(newTouches - 1, 2)], 900);
      setTimeout(() => setPhase("ai-turn"), 550);
    } else {
      setTouches(newTouches);
      showMsg(`Касание ${newTouches}/3`, "#8b5cf6", 700);
    }
  }, [phase, touches, team, showMsg, startServeAnim]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isMyWin = myScore > enemyScore;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628] select-none">
      {/* Scoreboard */}
      <div className="bg-[#0d1e3a] text-white px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.map((p) => (
              <div key={p.id} className="w-8 h-8 rounded-full border-2 border-[#0d1e3a] flex items-center justify-center text-sm" style={{ backgroundColor: p.color }}>
                {p.face}
              </div>
            ))}
          </div>
          <span className="font-black text-3xl text-green-400">{myScore}</span>
        </div>

        <div className="text-center">
          <div className="bg-yellow-400 text-gray-900 rounded-xl px-3 py-1 font-black text-lg">
            {minutes}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-xs text-white/40 mt-0.5">до {WIN_SCORE} очков</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-3xl text-red-400">{enemyScore}</span>
          <div className="flex -space-x-2">
            {ENEMY_PLAYERS.map((p, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0d1e3a] flex items-center justify-center text-sm" style={{ backgroundColor: p.color }}>
                {p.face}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ПОЛЕ */}
      <div
        ref={fieldRef}
        className="flex-1 relative overflow-hidden cursor-pointer"
        style={{ background: "linear-gradient(180deg, #1a3a5c 0%, #0f2744 100%)", touchAction: "none" }}
        onMouseMove={handleFieldMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchMove={handleFieldTouchMove}
        onTouchEnd={(e) => { stopDrag(); handleFieldTouchEndGame(e); }}
        onTouchStart={handleFieldTouchStartGame}
        onClick={handleFieldClick}
      >
        {/* Сетка — белая полоса */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col" style={{ width: 16 }}>
          <div className="flex-1" style={{
            backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 8px, transparent 8px, transparent 18px)",
          }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-3 bg-yellow-400 z-20 rounded-b" />

        {/* ИИ игроки — правая сторона */}
        <div className="absolute top-0 right-0 bottom-0 w-[48%] flex flex-col justify-around items-center py-6 pr-2">
          {ENEMY_PLAYERS.map((p, i) => (
            <div key={i} className={`transition-all duration-300 ${activePIdx === i && ballSide === "ai" ? "scale-125" : ""}`}>
              <CharacterFace color={p.color} face={p.face} size={40} jersey={p.name.slice(0, 3)} />
            </div>
          ))}
        </div>

        {/* Мои игроки — перетаскиваемые */}
        {team.map((p, i) => (
          <div
            key={p.id}
            className="absolute z-20 cursor-grab active:cursor-grabbing transition-transform duration-100"
            style={{
              left: `${playerPos[i].x}%`,
              top: `${playerPos[i].y}%`,
              transform: `translate(-50%, -50%) ${activePIdx === i ? "scale(1.25)" : "scale(1)"}`,
            }}
            onMouseDown={(e) => { e.stopPropagation(); handlePlayerMouseDown(e, i); }}
            onTouchStart={(e) => { e.stopPropagation(); handlePlayerTouchStart(e, i); }}
          >
            <CharacterFace color={p.color} face={p.face} size={40} jersey={p.name.slice(0, 3)} />
          </div>
        ))}

        {/* Мяч */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${ballX}%`,
            top: `${ballY}%`,
            transform: "translate(-50%, -50%)",
            transition: phase === "serve-anim" ? "all 800ms cubic-bezier(0.25,0.46,0.45,0.94)" : "all 500ms cubic-bezier(0.25,0.46,0.45,0.94)",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
          }}
        >
          <span className="text-3xl">{serveAnim ? "💨" : "🏐"}</span>
        </div>

        {/* Сообщение */}
        {msg && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl font-black text-white text-sm whitespace-nowrap shadow-xl z-40"
            style={{ backgroundColor: msg.color, animation: "slideIn 0.25s ease" }}
          >
            {msg.text}
          </div>
        )}

        {/* Подсказка свайп */}
        {phase === "waiting" && (
          <div className="absolute bottom-3 left-4 text-white/40 text-xs font-bold pointer-events-none">
            👆 свайп → атака · тащи игроков
          </div>
        )}

        {/* Индикатор касаний */}
        {phase === "waiting" && (
          <div className="absolute bottom-3 right-4 flex gap-1.5 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ backgroundColor: i < touches ? "#f59e0b" : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>
        )}

        {phase === "ai-turn" && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/40 text-xs font-bold animate-pulse pointer-events-none">
            ИИ думает... 🤖
          </div>
        )}

        {/* ФИНАЛ */}
        {phase === "gameover" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0d1e3a] border border-white/20 rounded-3xl p-8 text-center mx-4 shadow-2xl" style={{ animation: "slideIn 0.4s ease" }}>
              <div className="text-6xl mb-3 float-anim">{isMyWin ? "🏆" : myScore === enemyScore ? "🤝" : "😢"}</div>
              <div className="font-black text-3xl text-white mb-2">
                {isMyWin ? "ПОБЕДА!" : myScore === enemyScore ? "НИЧЬЯ!" : "ПОРАЖЕНИЕ"}
              </div>
              <div className="text-3xl font-black text-white/70 mb-6">{myScore} : {enemyScore}</div>
              <button
                onClick={() => onEndGame({ myScore, enemyScore, team })}
                className="bg-green-500 text-white font-black text-lg px-8 py-3 rounded-2xl active:scale-95 transition-transform"
              >
                Продолжить →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
