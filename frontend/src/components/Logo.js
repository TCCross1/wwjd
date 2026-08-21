import React from "react";
import heroLogo from "@/assets/wwjd-hero.png";

// The exact uploaded WWJD hero logo — never altered or regenerated.
export function Logo({ size = "lg", className = "", testid = "wwjd-hero-logo" }) {
  const sizes = {
    sm: "w-14 h-14",
    md: "w-40 max-w-[10rem]",
    lg: "w-72 sm:w-80 max-w-[20rem]",
    xl: "w-[20rem] sm:w-[26rem] md:w-[30rem] max-w-full",
  };
  return (
    <img
      src={heroLogo}
      alt="W.W.J.D. — What Would Jesus Do?"
      data-testid={testid}
      className={`${sizes[size] || sizes.lg} h-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
}

export default Logo;
