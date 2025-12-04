export interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const sizeStyles = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-slate-400">{progress}%</span>
          )}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-800 ${sizeStyles[size]}`}>
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
