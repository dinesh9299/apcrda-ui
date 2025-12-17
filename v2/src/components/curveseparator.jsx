export default function CurveSeparator() {
  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="none"
      className="absolute top-0 left-0 h-full w-[260px] pointer-events-none"
    >
      <path
        d="
          M 260 0
          C 180 40, 160 120, 140 200
          L 300 200
          L 300 0
          Z
        "
        fill="#fbbf24"
      />
    </svg>
  );
}
