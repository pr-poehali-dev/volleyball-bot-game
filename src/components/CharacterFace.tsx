interface CharacterFaceProps {
  color: string;
  face: string;
  size?: number;
  wobble?: boolean;
  jersey?: string;
}

export default function CharacterFace({ color, face, size = 48, wobble = false, jersey }: CharacterFaceProps) {
  return (
    <div className={`relative inline-flex flex-col items-center ${wobble ? "wobbly" : ""}`}>
      <div
        className="rounded-full flex items-center justify-center shadow-lg border-4 border-white"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`,
          fontSize: size * 0.45,
        }}
      >
        {face}
      </div>
      {jersey && (
        <div
          className="rounded-lg text-white text-xs font-black px-2 py-0.5 mt-1 shadow"
          style={{ backgroundColor: color, fontSize: size * 0.22 }}
        >
          {jersey}
        </div>
      )}
    </div>
  );
}
