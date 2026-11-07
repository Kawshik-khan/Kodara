import React from "react";

export interface NavIconProps {
  size?: number | string;
  className?: string;
}

export const TsBadgeIcon: React.FC<NavIconProps> = ({ size = 18, className }) => (
  <div
    className={className}
    style={{
      width: size,
      height: size,
      backgroundColor: "#3178C6",
      color: "#FFFFFF",
      borderRadius: "3px",
      fontSize: "9px",
      fontWeight: 800,
      fontFamily: "var(--font-mono)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      flexShrink: 0,
    }}
  >
    TS
  </div>
);

export const PythonIcon: React.FC<NavIconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M11.9 2C6.9 2 7.2 4.2 7.2 4.2L7.2 6.5H12V7.2H5.1C2.5 7.2 2 9.5 2 11.9C2 14.3 2.9 14.6 4.3 14.6H5.7V12.6C5.7 10.4 7.5 10.4 7.5 10.4H12.3C14.3 10.4 14.3 8.6 14.3 8.6V4.2C14.3 4.2 14.2 2 11.9 2ZM9.5 3.5C10 3.5 10.4 3.9 10.4 4.4C10.4 4.9 10 5.3 9.5 5.3C9 5.3 8.6 4.9 8.6 4.4C8.6 3.9 9 3.5 9.5 3.5Z"
      fill="#3776AB"
    />
    <path
      d="M12.1 22C17.1 22 16.8 19.8 16.8 19.8L16.8 17.5H12V16.8H18.9C21.5 16.8 22 14.5 22 12.1C22 9.7 21.1 9.4 19.7 9.4H18.3V11.4C18.3 13.6 16.5 13.6 16.5 13.6H11.7C9.7 13.6 9.7 15.4 9.7 15.4V19.8C9.7 19.8 9.8 22 12.1 22ZM14.5 20.5C14 20.5 13.6 20.1 13.6 19.6C13.6 19.1 14 18.7 14.5 18.7C15 18.7 15.4 19.1 15.4 19.6C15.4 20.1 15 20.5 14.5 20.5Z"
      fill="#FFD43B"
    />
  </svg>
);

export const ReactIcon: React.FC<NavIconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#00D8FF" strokeWidth="1.5" className={className}>
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="1.5" fill="#00D8FF" />
  </svg>
);

export const DotMatrixIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg width={size} height={Number(size) * 1.3} viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="3" cy="3" r="1.5" fill="#FF5E1E" />
    <circle cx="8" cy="3" r="1.5" fill="#FF5E1E" />
    <circle cx="13" cy="3" r="1.5" fill="#FF5E1E" />
    <circle cx="3" cy="8" r="1.5" fill="#FF5E1E" />
    <circle cx="8" cy="8" r="1.5" fill="#FF5E1E" />
    <circle cx="13" cy="8" r="1.5" fill="#FF5E1E" />
    <circle cx="3" cy="13" r="1.5" fill="#FF5E1E" />
    <circle cx="8" cy="13" r="1.5" fill="#FF5E1E" />
    <circle cx="13" cy="13" r="1.5" fill="#FF5E1E" />
    <circle cx="3" cy="18" r="1.5" fill="#FF5E1E" />
    <circle cx="8" cy="18" r="1.5" fill="#FF5E1E" />
    <circle cx="13" cy="18" r="1.5" fill="#FF5E1E" />
  </svg>
);

