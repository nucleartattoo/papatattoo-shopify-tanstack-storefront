import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  showText?: boolean
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizeMap = {
    sm: { icon: 34, font: 'text-sm' },
    md: { icon: 44, font: 'text-base' },
    lg: { icon: 60, font: 'text-xl' },
    hero: { icon: 160, font: 'text-3xl' },
  }

  const { icon: dimension } = sizeMap[size]

  return (
    <div className={`flex items-center ${showText ? 'gap-3' : ''} select-none ${className}`}>
      {/* Precision Geometric P Emblem SVG */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Outer Dark Circular Chassis */}
        <circle cx="100" cy="100" r="96" fill="#090A0C" stroke="#2EE6CA" strokeWidth="2" strokeOpacity="0.4" />

        {/* Cyber Cyan Letter "P" Silhouette Body */}
        <path
          d="M48 24H128C158 24 176 42 176 72C176 102 158 120 128 120H96V176H48V24Z"
          fill="#2EE6CA"
        />

        {/* Inner Counter cutout of the "P" */}
        <path
          d="M96 50H124C140 50 150 60 150 72C150 84 140 94 124 94H96V50Z"
          fill="#090A0C"
        />

        {/* Sacred Geometry / 3D Octahedral Wireframe Structure in loop of P */}
        <g stroke="#2EE6CA" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Octagon / Diamond bounds */}
          <polygon points="124,32 162,56 162,88 124,112 86,88 86,56" fill="rgba(9, 10, 12, 0.75)" />

          {/* Inner isometric projection cube/nodes */}
          <polygon points="124,46 148,62 148,82 124,98 100,82 100,62" fill="none" strokeWidth="2" />

          {/* Internal diagonal struts */}
          <line x1="124" y1="32" x2="124" y2="112" strokeWidth="2.2" />
          <line x1="86" y1="56" x2="162" y2="88" strokeWidth="1.8" />
          <line x1="86" y1="88" x2="162" y2="56" strokeWidth="1.8" />
          <line x1="100" y1="62" x2="148" y2="82" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="100" y1="82" x2="148" y2="62" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Central node pulse point */}
          <circle cx="124" cy="72" r="5" fill="#2EE6CA" />
        </g>

        {/* Bold "PAPA" Vertical Typography in Solid White */}
        <g fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1">
          <text x="52" y="58" fontSize="24">P</text>
          <text x="52" y="86" fontSize="24">A</text>
          <text x="52" y="114" fontSize="24">P</text>
          <text x="52" y="142" fontSize="24">A</text>
        </g>

        {/* Sub-label TATTOO SUPPLY vertical column */}
        <text
          x="77"
          y="166"
          fill="#090A0C"
          fontSize="10"
          fontWeight="800"
          letterSpacing="2"
          transform="rotate(-90 77 166)"
        >
          TATTOO SUPPLY
        </text>
      </svg>

      {/* Brand Text for Header / Footers */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-zinc-950 dark:text-zinc-100 text-lg md:text-xl uppercase font-sans">
              PAPA
            </span>
            <span className="font-bold tracking-wider text-[#0d9488] dark:text-[#2ee6ca] text-lg md:text-xl uppercase">
              TATTOO
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
              SUPPLY CO.
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2ee6ca]"></span>
            <span className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400">
              PRO ONLY
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
