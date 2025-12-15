import React from "react";

interface DigitProps {
  value: number;
  label: string;
  isCritical?: boolean;
}

const Digit: React.FC<DigitProps> = ({ value, label, isCritical = false }) => {
  // Pad with zero
  const formatted = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center mx-2 sm:mx-4 md:mx-6">
      <div
        className={`
        relative flex items-center justify-center
        /* Default Mobile Portrait */
        w-16 h-20
        /* Mobile Landscape: Shrink slightly if needed, but mainly standard sm applies.
           We use 'landscape:sm:...' to target phones in landscape specifically if they trigger 'sm'.
           Usually 'sm' is 640px+. Landscape phones are >640px.
           We enforce a moderate size for landscape phones to ensure fit. */
        landscape:w-16 landscape:h-20
        landscape:sm:w-20 landscape:sm:h-28
        /* Desktop/Tablet standard sizes */
        md:w-40 md:h-48 lg:w-48 lg:h-56

        bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700
        shadow-2xl overflow-hidden
        transition-all duration-300
        ${isCritical ? "bg-cyan-900/30 border-cyan-500/50 animate-critical" : ""}
      `}
      >
        {/* Background shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <span
          className={`
          font-mono font-bold leading-none
          /* Text sizing */
          text-4xl
          landscape:text-4xl
          landscape:sm:text-5xl
          sm:text-6xl md:text-8xl lg:text-9xl

          ${isCritical ? "text-cyan-400" : "text-blue-100"}
          drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]
        `}
        >
          {formatted}
        </span>
      </div>
      <span className="mt-4 text-xs sm:text-sm md:text-lg font-medium text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
};

export default Digit;
