export interface Player {
  id: number;
  name: string;
  emoji: string;
  face: string;
  color: string;
  bgColor: string;
  speed: number;
  reaction: number;
  power: number;
  role: string;
  description: string;
  trait: string;
}

export const ALL_PLAYERS: Player[] = [
  {
    id: 1,
    name: "НУРИК",
    emoji: "🏐",
    face: "😄",
    color: "#FF6B6B",
    bgColor: "#FFE5E5",
    speed: 3,
    reaction: 7,
    power: 10,
    role: "ЦБ",
    description: "Центральный блокирующий — стена у сетки!",
    trait: "Железный блок",
  },
  {
    id: 2,
    name: "ИЛЬЯС",
    emoji: "💪",
    face: "😎",
    color: "#FFB627",
    bgColor: "#FFF5D6",
    speed: 8,
    reaction: 9,
    power: 9,
    role: "ЦБ",
    description: "Мощный блок и убойная атака с линии.",
    trait: "Двойной блок",
  },
  {
    id: 3,
    name: "ТИМУР",
    emoji: "🎯",
    face: "😏",
    color: "#A29BFE",
    bgColor: "#EEE9FF",
    speed: 8,
    reaction: 10,
    power: 6,
    role: "Связ",
    description: "Мозг команды. Точная передача в любую точку.",
    trait: "Идеальный пас",
  },
  {
    id: 4,
    name: "БУЛАТ",
    emoji: "⚡",
    face: "😤",
    color: "#FFB627",
    bgColor: "#FFF5D6",
    speed: 10,
    reaction: 9,
    power: 8,
    role: "Диаг",
    description: "Диагональный нападающий — бьёт с любой позиции!",
    trait: "Гиперскорость",
  },
  {
    id: 5,
    name: "ШАМИЛЬ",
    emoji: "🦁",
    face: "😆",
    color: "#6BCB77",
    bgColor: "#E5F5E7",
    speed: 7,
    reaction: 8,
    power: 7,
    role: "Доигр",
    description: "Доигровщик — надёжный в атаке и приёме.",
    trait: "Универсальный",
  },
];

export const ACHIEVEMENTS = [
  { id: 1, icon: "🏆", name: "Чемпион", desc: "Выиграй 10 матчей" },
  { id: 2, icon: "⚽", name: "Снайпер", desc: "Забей 50 голов" },
  { id: 3, icon: "🧤", name: "Стена", desc: "Отбей 30 ударов" },
  { id: 4, icon: "⚡", name: "Молниеносный", desc: "Забей за 10 секунд" },
  { id: 5, icon: "🎯", name: "Точность", desc: "5 голов подряд" },
  { id: 6, icon: "🌟", name: "MVP", desc: "Стань лучшим игроком матча" },
];