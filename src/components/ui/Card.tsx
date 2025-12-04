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
      className={`rounded-xl border border-slate-800 bg-slate-900/50 shadow-lg shadow-slate-900/60 transition-all ${
        paddingStyles[padding]
      } ${hover ? "hover:border-slate-700 hover:shadow-xl" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
