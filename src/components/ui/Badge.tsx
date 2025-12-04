export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-700 text-slate-200",
    success: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30",
    danger: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30",
    info: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
