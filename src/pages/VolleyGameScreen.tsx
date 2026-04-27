import { useState, useEffect, useRef, useCallback } from "react";
import { Player } from "@/data/players";
import CharacterFace from "@/components/CharacterFace";

interface VolleyGameScreenProps {
  team: Player[];
  onEndGame: (result: { myScore: number; enemyScore: number; team: Player[] }) => void;
}

type Phase =
  | "serve-anim"   // анимация подачи
  | "waiting"      // мяч на чужой половине — ждём свайп
  | "ball-flying"  // мяч летит
  | "ai-turn"      // ИИ обрабатывает
  | "scored"       // очко
  | "gameover";

type Side = "player" | "ai";

const ENEMY_PLAYERS = [
  { color: "#E74C3C", face: "😈", name: "Злодей" },
  { color: "#8E44AD", face: "👺", name: "Монстр" },
  { color: "#2C3E50", face: "🤖", name: "Робот" },
];

const WIN_SCORE = 7;
const TIME_LIMIT = 60;

const AI_SPEED = 900; // ms задержки ИИ

export default function VolleyGameScreen({ team, onEndGame }: VolleyGameScreenProps) {
  const [myScore, setMyScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [phase, setPhase] = useState<Phase>("serve-anim");
  const [serveSide, setServeSide] = useState<Side>("player");
  const [touches, setTouches] = useState(0);
  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(50);
  const [ballSide, setBallSide] = useState<Side>("player");
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null);
  const [serveAnim, setServeAnim] = useState(false);
  const [activePIdx, setActivePIdx] = useState<number | null>(null);
  const [swipeZoneActive, setSwipeZoneActive] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMsg = useCallback((text: string, color: string, duration = 1800) => {
    setMsg({ text, color });
    setTimeout(() => setMsg(null), duration);
  }, []);

  const pickActivePIdx = useCallback(() => {
    return Math.floor(Math.random() * team.length);
  }, [team]);

  const startServeAnim = useCallback((side: Side) => {
    setPhase("serve-anim");
    setServeAnim(true);
    setBallX(side === "player" ? 20 : 80);
    setBallY(70);
    showMsg(side === "player" ? "Ваша подача! 🏐" : "Подача противника 😈", side === "player" ? "#3b82f6" : "#ef4444", 1200);

    setTimeout(() => {
      setServeAnim(false);
      const targetX = side === "player" ? 75 : 25;
      const targetY = 35 + Math.random() * 30;
      setBallX(targetX);
      setBallY(targetY);
      setBallSide(side === "player" ? "ai" : "player");
      setTouches(0);

      if (side === "player") {
        setPhase("ai-turn");
      } else {
        setPhase("waiting");
      }
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

  // Проверка на победу по очкам
  useEffect(() => {
    if (myScore >= WIN_SCORE || enemyScore >= WIN_SCORE) {
      setPhase("gameover");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [myScore, enemyScore]);

  // Старт игры
  useEffect(() => {
    startServeAnim("player");
  }, []);

  // Логика ИИ
  useEffect(() => {
    if (phase !== "ai-turn") return;

    aiTimerRef.current = setTimeout(() => {
      const rnd = Math.random();
      const pwr = ENEMY_PLAYERS[0]; // "сила" ИИ

      // ИИ иногда ошибается (30%)
      if (rnd < 0.30) {
        showMsg("📵 Ошибка противника! +1 вам", "#22c55e");
        setMyScore((s) => s + 1);
        setServeSide("player");
        setPhase("serve-anim");
        setTimeout(() => startServeAnim("player"), 1200);
        return;
      }

      // ИИ отбивает — перекидывает на нашу сторону
      const newX = 15 + Math.random() * 30;
      const newY = 30 + Math.random() * 40;

      setActivePIdx(0);
      setTimeout(() => setActivePIdx(null), 400);

      setBallX(newX);
      setBallY(newY);
      setBallSide("player");
      setTouches(0);
      setPhase("waiting");
      showMsg("Мяч на вашей стороне!", "#8b5cf6", 1000);
    }, AI_SPEED + Math.random() * 400);

    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [phase, showMsg, startServeAnim]);

  // Обработка нажатия зоны (клик для десктопа)
  const handleZoneClick = useCallback((e: React.MouseEvent) => {
    if (phase !== "waiting") return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    processHit(dx, 0);
  }, [phase, touches]);

  // Свайп обработка
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (phase !== "waiting") return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setSwipeZoneActive(true);
  }, [phase]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (phase !== "waiting") return;
    setSwipeZoneActive(false);
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    processHit(dx, dy);
  }, [phase, touches]);

  const processHit = useCallback((dx: number, dy: number) => {
    if (phase !== "waiting") return;

    const newTouches = touches + 1;
    const pIdx = pickActivePIdx();
    setActivePIdx(pIdx);
    setTimeout(() => setActivePIdx(null), 500);

    // Если свайп не в сторону противника (влево = плохо, вправо = хорошо)
    const isGoodSwipe = dx > 20 || (Math.abs(dx) < 20); // клик тоже считается

    if (newTouches >= 3 && !isGoodSwipe) {
      // 3 касания — потеря мяча
      showMsg("🚫 3 касания! Очко противнику", "#ef4444");
      setEnemyScore((s) => s + 1);
      setServeSide("ai");
      setPhase("serve-anim");
      setTimeout(() => startServeAnim("ai"), 1200);
      setTouches(0);
      return;
    }

    if (isGoodSwipe) {
      // Хорошая атака — перекидываем на ИИ
      const power = Math.min(Math.abs(dx) / 80, 1);
      const newX = 60 + power * 25;
      const newY = 25 + Math.random() * 50;

      setBallX(newX);
      setBallY(newY);
      setBallSide("ai");
      setTouches(0);

      if (newTouches === 1) showMsg(`${team[pIdx].name}: пас! 🏐`, "#3b82f6", 900);
      else if (newTouches === 2) showMsg(`${team[pIdx].name}: атака! 💥`, "#f59e0b", 900);
      else showMsg(`${team[pIdx].name}: удар! ⚡`, "#22c55e", 900);

      setTimeout(() => setPhase("ai-turn"), 600);
    } else {
      // Плохой свайп (влево) — передача внутри
      setTouches(newTouches);
      showMsg(`Касание ${newTouches}/3`, "#8b5cf6", 700);
    }
  }, [phase, touches, team, pickActivePIdx, showMsg, startServeAnim]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isMyWin = myScore > enemyScore;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628] select-none">
      {/* Scoreboard */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.map((p) => (
              <div
                key={p.id}
                className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-sm"
                style={{ backgroundColor: p.color }}
              >
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
          <div className="text-xs text-gray-500 mt-0.5">до {WIN_SCORE} очков</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-black text-3xl text-red-400">{enemyScore}</span>
          <div className="flex -space-x-2">
            {ENEMY_PLAYERS.map((p, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center text-sm"
                style={{ backgroundColor: p.color }}
              >
                {p.face}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ПОЛЕ */}
      <div className="flex-1 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #1a3a5c 0%, #0f2744 100%)" }}>

        {/* Сетка (белая полоса посередине) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/80 z-10" />
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 18,
            backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 10px, transparent 10px, transparent 22px)",
          }}
        />
        {/* Верхняя лента сетки */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-3 bg-yellow-400 z-20 rounded-b" />

        {/* Зона ИИ — правая половина */}
        <div className="absolute top-0 bottom-0 right-0 w-[48%] flex flex-col justify-around items-center py-6 pr-2">
          {ENEMY_PLAYERS.map((p, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${activePIdx === i && ballSide === "ai" ? "scale-125" : ""}`}
            >
              <CharacterFace color={p.color} face={p.face} size={40} jersey={p.name.slice(0, 3)} />
            </div>
          ))}
        </div>

        {/* Зона игрока — левая половина */}
        <div className="absolute top-0 left-0 w-[48%] flex flex-col justify-around items-center py-6 pl-2">
          {team.map((p, i) => (
            <div
              key={p.id}
              className={`transition-all duration-300 ${activePIdx === i ? "scale-125" : ""}`}
            >
              <CharacterFace color={p.color} face={p.face} size={40} jersey={p.name.slice(0, 3)} />
            </div>
          ))}
        </div>

        {/* МЯЧ */}
        <div
          className="absolute z-30 pointer-events-none transition-all"
          style={{
            left: `${ballX}%`,
            top: `${ballY}%`,
            transform: "translate(-50%, -50%)",
            transitionDuration: phase === "serve-anim" ? "800ms" : "500ms",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
          }}
        >
          <span className="text-3xl">{serveAnim ? "💨" : "🏐"}</span>
        </div>

        {/* Сообщение */}
        {msg && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl font-black text-white text-sm whitespace-nowrap shadow-xl z-40"
            style={{ backgroundColor: msg.color, animation: "slideIn 0.3s ease" }}
          >
            {msg.text}
          </div>
        )}

        {/* ФИНАЛЬНЫЙ ЭКРАН */}
        {phase === "gameover" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center mx-4 shadow-2xl" style={{ animation: "slideIn 0.4s ease" }}>
              <div className="text-6xl mb-2">{isMyWin ? "🏆" : myScore === enemyScore ? "🤝" : "😢"}</div>
              <div className="font-black text-3xl text-gray-800 mb-1">
                {isMyWin ? "ПОБЕДА!" : myScore === enemyScore ? "НИЧЬЯ!" : "ПОРАЖЕНИЕ"}
              </div>
              <div className="text-2xl font-black text-gray-600 mb-5">{myScore} : {enemyScore}</div>
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

      {/* ЗОНА КАСАНИЯ */}
      <div
        className={`relative cursor-pointer transition-all duration-200 ${phase === "waiting" ? "opacity-100" : "opacity-50 pointer-events-none"}`}
        style={{
          minHeight: 130,
          background: swipeZoneActive
            ? "linear-gradient(180deg, #1e3a5f 0%, #2563eb22 100%)"
            : phase === "waiting"
            ? "linear-gradient(180deg, #1e3a5f 0%, #0f2744 100%)"
            : "#111827",
          borderTop: `2px solid ${phase === "waiting" ? "#3b82f6" : "#374151"}`,
        }}
        onClick={handleZoneClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Индикатор касаний */}
        <div className="flex justify-center gap-2 pt-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-200"
              style={{
                backgroundColor: i < touches ? "#f59e0b" : phase === "waiting" ? "#3b82f680" : "#374151",
                transform: i < touches ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-1 py-3">
          {phase === "waiting" ? (
            <>
              <div className="text-white font-black text-lg">
                {ballSide === "player" ? "👆 Нажми или свайпни →" : "Мяч у противника..."}
              </div>
              <div className="text-gray-400 text-sm">свайп вправо = атака · касаний: {touches}/3</div>
            </>
          ) : phase === "ai-turn" ? (
            <div className="text-gray-400 font-bold text-base animate-pulse">ИИ думает... 🤖</div>
          ) : phase === "serve-anim" ? (
            <div className="text-blue-400 font-bold text-base">🏐 Подача...</div>
          ) : (
            <div className="text-gray-600 font-bold text-base">— — —</div>
          )}
        </div>

        {/* Стрелка направления */}
        {phase === "waiting" && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400 text-2xl animate-pulse">
            →
          </div>
        )}
      </div>
    </div>
  );
}
