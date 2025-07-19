
import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 1.5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#dcdcdca4] from-accent to-secondary bg-clip-text  inline-block ${disabled ? "" : "animate-shine"} ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(100, 255, 218, 0) 40%, rgba(100, 255, 218, 0.8) 50%, rgba(100, 255, 218, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;


