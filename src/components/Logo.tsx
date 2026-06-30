import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 48 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        {/* Outer Circle Ring Gradient */}
        <linearGradient id="ringGradient" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" /> {/* Purple */}
          <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
          <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan */}
        </linearGradient>

        {/* Bottom Swoosh Wave Gradient */}
        <linearGradient id="waveGradient" x1="20" y1="50" x2="70" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" /> {/* Emerald */}
          <stop offset="50%" stopColor="#06B6D4" /> {/* Cyan */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Blue */}
        </linearGradient>

        {/* Text/Theme Indigo Accent */}
        <linearGradient id="indigoTeal" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Clock ticks / Dashes representing the time aspect */}
      <circle cx="50" cy="50" r="44" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4 8" />
      <circle cx="50" cy="50" r="44" stroke="url(#ringGradient)" strokeWidth="3.5" strokeDasharray="140 360" strokeLinecap="round" />

      {/* Dynamic Clock ticks */}
      <line x1="50" y1="12" x2="50" y2="15" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="50" x2="85" y2="50" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="88" x2="50" y2="85" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="50" x2="15" y2="50" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      {/* Sparkle star indicator on top left of the clock */}
      <path
        d="M41 24C41 25.5 41.5 27 43 27C41.5 27 41 28.5 41 30C41 28.5 40.5 27 39 27C40.5 27 41 25.5 41 24Z"
        fill="#A78BFA"
      />

      {/* Clock Hands inside the top right part */}
      <path
        d="M48 30L56 36L68 28"
        stroke="#1E293B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 30L56 36L68 28"
        stroke="url(#ringGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Human Silhouette merged with Task checklist on the center-left */}
      {/* Background shadow for silhouette definition */}
      <path
        d="M32 32H44C49.5 32 54 36.5 54 42C54 44.5 53 46.8 51.5 48.5C53.2 50.2 55.5 52 55 55C54.5 58 50 62 43 62H32V32Z"
        fill="#020617"
      />

      {/* Custom stylized task page document clip */}
      <rect x="30" y="32" width="18" height="22" rx="4" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
      
      {/* Multi-colored checkmarks inside the checklist */}
      {/* 1st Check - Violet */}
      <path d="M34 39L36 41L40 37" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="43" y1="39" x2="47" y2="39" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* 2nd Check - Cyan */}
      <path d="M34 45L36 47L40 43" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="43" y1="45" x2="47" y2="45" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

      {/* 3rd Check - Emerald */}
      <path d="M34 51L36 53L40 49" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="43" y1="51" x2="47" y2="51" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Human silhouette outline facing right, aligned from the page */}
      <path
        d="M43 32C49 32 54 37 54 43C54 45.8 53 48.2 51.5 50L54 53L51 56C51 58 48.5 61 44 61"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 32C49 32 54 37 54 43C54 45.8 53 48.2 51.5 50L54 53L51 56C51 58 48.5 61 44 61"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Teal/Green wave/swoosh fluid tail at the bottom */}
      <path
        d="M25 47C25 47 24 58 35 62C42.5 64.8 52 59.5 58 64C63 67.8 65 62 65 62C65 62 58 56 47 56C36 56 25 47 25 47Z"
        fill="url(#waveGradient)"
        opacity="0.85"
      />
      <path
        d="M25 47C28 55 35 59.5 44 60.5C53 61.5 62 58.5 65 62"
        stroke="#10B981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
