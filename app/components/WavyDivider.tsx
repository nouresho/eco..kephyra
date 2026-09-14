type WavyDividerProps = {
  color: string;
};

export default function WavyDivider({
  color,
}: WavyDividerProps) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 z-50 w-full translate-y-[98%] overflow-hidden leading-none">

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[55px] w-full md:h-[85px]"
      >
        <path
          d="
            M0 26
            C90 5, 150 48, 245 28
            C340 7, 420 55, 520 29
            C615 5, 700 50, 800 27
            C905 2, 980 51, 1080 29
            C1185 5, 1290 51, 1440 23
            L1440 120
            L0 120
            Z
          "
          fill={color}
        />
      </svg>
    </div>
  );
}