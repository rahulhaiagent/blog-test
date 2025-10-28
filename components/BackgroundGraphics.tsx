export default function BackgroundGraphics() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Large Flowing Wave - Top Right Corner Only */}
      <svg
        className="absolute -top-32 -right-64 w-[900px] h-[900px] opacity-40"
        viewBox="0 0 800 800"
        fill="none"
      >
        <path
          d="M400,100 Q600,150 700,300 T800,600 L800,0 L0,0 Z"
          fill="#dbeafe"
        />
      </svg>

      {/* Large Pentagon - Top Right */}
      <svg
        className="absolute top-10 -right-40 w-[500px] h-[500px] opacity-20"
        viewBox="0 0 100 100"
        fill="#93c5fd"
      >
        <polygon points="50,5 95,35 80,85 20,85 5,35" />
      </svg>

      {/* Medium Hexagon - Top Right */}
      <svg
        className="absolute top-32 right-20 w-[300px] h-[300px] opacity-25"
        viewBox="0 0 100 100"
        fill="#bfdbfe"
      >
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
      </svg>

      {/* AI Neural Network - Top Right */}
      <svg
        className="absolute top-48 right-48 w-[250px] h-[250px] opacity-15"
        viewBox="0 0 200 200"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="0.5"
      >
        {/* Neural connections */}
        <line x1="30" y1="50" x2="100" y2="80" strokeWidth="1" />
        <line x1="30" y1="100" x2="100" y2="80" strokeWidth="1" />
        <line x1="100" y1="80" x2="170" y2="100" strokeWidth="1" />
        
        {/* Nodes */}
        <circle cx="30" cy="50" r="5" fill="#93c5fd" opacity="0.6" />
        <circle cx="30" cy="100" r="5" fill="#93c5fd" opacity="0.6" />
        <circle cx="100" cy="80" r="7" fill="#60a5fa" opacity="0.8" />
        <circle cx="170" cy="100" r="8" fill="#3b82f6" />
      </svg>

      {/* Small Pentagon Cluster - Top Right */}
      <svg
        className="absolute top-64 right-12 w-[200px] h-[200px] opacity-18"
        viewBox="0 0 100 100"
        fill="#93c5fd"
      >
        <polygon points="30,10 50,5 70,10 75,30 65,45 35,45 25,30" opacity="0.5" />
        <polygon points="60,55 75,50 90,55 95,70 85,83 65,83 55,70" opacity="0.4" />
      </svg>
    </div>
  );
}

