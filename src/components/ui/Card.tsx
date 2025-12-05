export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm transition-all ${
        paddingStyles[padding]
      } ${hover ? "hover:border-[#FF4D28]/30 hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
