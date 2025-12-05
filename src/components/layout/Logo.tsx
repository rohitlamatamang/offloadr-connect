import Link from "next/link";

interface LogoProps {
  size?: "sm" | "lg";
}

export default function Logo({ size = "sm" }: LogoProps) {
  const isLarge = size === "lg";
  const logoSize = isLarge ? 44 : 32;
  
  return (
    <Link href="/" className="inline-flex items-center gap-3 group">
      <div className={`relative ${isLarge ? "h-11 w-11" : "h-8 w-8"} transition-transform group-hover:scale-105`}>
        <svg 
          viewBox="0 0 600 600" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          <g transform="translate(100,50)">
            <rect x="0" y="0" width="140" height="140" fill="#1A1A1A" />
            <rect x="155" y="0" width="160" height="70" fill="#FF4D28" />
            <rect x="155" y="80" width="250" height="190" fill="#FF4D28" />
            <rect x="-70" y="150" width="210" height="210" fill="#1A1A1A" />
            <rect x="-9" y="370" width="150" height="80" fill="#1A1A1A" />
            <rect x="155" y="280" width="150" height="150" fill="#FF4D28" />
          </g>
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`font-bold text-[#1A1A1A] tracking-tight ${isLarge ? "text-xl" : "text-base"}`}>
          Offloadr <span className="font-normal text-[#FF4D28]">Connect</span>
        </span>
        <span className={`text-gray-600 font-medium ${isLarge ? "text-xs" : "text-[10px]"}`}>
          Client Communication Hub
        </span>
      </div>
    </Link>
  );
}
