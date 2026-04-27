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
    name: "Толстяк Борис",
    emoji: "🍕",
    face: "😄",
    color: "#FF6B6B",
    bgColor: "#FFE5E5",
    speed: 3,
    reaction: 7,
    power: 10,
    role: "ЦБ",
    description: "Медленный, но его не остановить! Сила удара — легендарная.",
    trait: "Железный удар",
  },
  {
    id: 2,
    name: "Молния Петя",
    emoji: "⚡",
    face: "😤",
    color: "#FFB627",
    bgColor: "#FFF5D6",
    speed: 10,
    reaction: 9,
    power: 4,
    role: "Диаг",
    description: "Быстрее ветра! Никто не успевает его поймать.",
    trait: "Гиперскорость",
  },
  {
    id: 3,
    name: "Великан Гена",
    emoji: "🦁",
    face: "😎",
    color: "#6BCB77",
    bgColor: "#E5F5E7",
    speed: 4,
    reaction: 6,
    power: 9,
    role: "Доигр",
    description: "Гора мышц. Никто не пройдёт через его зону!",
    trait: "Непробиваемый",
  },
  {
    id: 4,
    name: "Хитрюга Саша",
    emoji: "🦊",
    face: "😏",
    color: "#FF9F43",
    bgColor: "#FFF0E0",
    speed: 7,
    reaction: 10,
    power: 6,
    role: "Либеро",
    description: "Читает игру как книгу. Всегда знает, что будет дальше.",
    trait: "Орлиный глаз",
  },
  {
    id: 5,
    name: "Акробат Вася",
    emoji: "🤸",
    face: "😆",
    color: "#A29BFE",
    bgColor: "#EEE9FF",
    speed: 8,
    reaction: 8,
    power: 5,
    role: "Связ",
    description: "Летает по воротам! Берёт самые невероятные мячи.",
    trait: "Суперрефлекс",
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