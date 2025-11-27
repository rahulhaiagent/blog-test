export default function BackgroundGraphics() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Elegant Curved Wave Lines - Top Right Corner */}
      <svg
        className="absolute -top-20 -right-20 w-[1200px] h-[800px]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Multiple curved lines creating the wave effect */}
        {[...Array(25)].map((_, i) => {
          const offset = i * 20;
          const opacity = Math.max(0.03, 0.15 - i * 0.006);
          return (
            <path
              key={i}
              d={`M ${600 + offset},0 Q ${700 + offset},${100 + offset} ${800 + offset},${200 + offset} T ${1000 + offset},${400 + offset}`}
              stroke="#93c5fd"
              strokeWidth="1.5"
              fill="none"
              opacity={opacity}
            />
          );
        })}
        
        {/* Additional curved lines for depth */}
        {[...Array(20)].map((_, i) => {
          const offset = i * 25;
          const opacity = Math.max(0.02, 0.12 - i * 0.005);
          return (
            <path
              key={`depth-${i}`}
              d={`M ${650 + offset},${-50 + offset} Q ${750 + offset},${80 + offset} ${850 + offset},${220 + offset} T ${1050 + offset},${450 + offset}`}
              stroke="#bfdbfe"
              strokeWidth="1"
              fill="none"
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
}

