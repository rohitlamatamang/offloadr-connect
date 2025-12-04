export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function Avatar({
  name,
  src,
  size = "md",
  color,
  className = "",
}: AvatarProps) {
  const sizeStyles = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const backgroundColor = color || "bg-indigo-600";

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${sizeStyles[size]} ${
        src ? "" : backgroundColor
      } ${className}`}
      style={color && !color.startsWith("bg-") ? { backgroundColor: color } : {}}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
