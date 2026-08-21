import React from "react";

// A golden halo + glow "angel" badge, shown like a small trophy of appreciation.
export function AngelBadge({ size = 96, name, className = "", testid = "angel-badge" }) {
  const halo = Math.round(size * 0.62);
  return (
    <div className={`flex flex-col items-center ${className}`} data-testid={testid}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 1.25 }}>
        {/* halo */}
        <div
          className="absolute rounded-full"
          style={{
            width: halo,
            height: halo * 0.34,
            top: size * 0.02,
            border: "3px solid #D4AF37",
            boxShadow: "0 0 16px 3px rgba(212,175,55,0.55)",
          }}
        />
        {/* glow orb */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.82,
            height: size * 0.82,
            bottom: 0,
            background: "radial-gradient(circle at 50% 35%, #FCEFC6 0%, #E9C766 55%, #D4AF37 100%)",
            boxShadow: "0 8px 30px rgba(212,175,55,0.45)",
          }}
        />
        {/* heart mark */}
        <svg
          viewBox="0 0 24 24"
          className="absolute"
          style={{ width: size * 0.36, height: size * 0.36, bottom: size * 0.24, color: "#8A5A1E" }}
          fill="currentColor"
        >
          <path d="M12 21s-6.7-4.35-9.33-8.36C.9 9.9 2.1 6.5 5.2 6.06c1.9-.27 3.5.8 4.3 2.1.8-1.3 2.4-2.37 4.3-2.1 3.1.44 4.3 3.84 2.53 6.58C18.7 16.65 12 21 12 21z" />
        </svg>
      </div>
      {name && <p className="mt-1 font-serif-display text-wwjd-text text-sm">{name}</p>}
    </div>
  );
}

export default AngelBadge;
