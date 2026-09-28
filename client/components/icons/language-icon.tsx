import { Code2 } from "lucide-react";
import type { IconType } from "react-icons";
import {
    SiC,
    SiClojure,
    SiCplusplus,
    SiCrystal,
    SiCss,
    SiDart,
    SiDocker,
    SiElixir,
    SiErlang,
    SiFsharp,
    SiGnubash,
    SiGo,
    SiGraphql,
    SiHaskell,
    SiHtml5,
    SiJavascript,
    SiJson,
    SiJupyter,
    SiKotlin,
    SiLua,
    SiMarkdown,
    SiPhp,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiR,
    SiReact,
    SiRuby,
    SiRust,
    SiScala,
    SiSolidity,
    SiSqlite,
    SiSvelte,
    SiSwift,
    SiTailwindcss,
    SiTypescript,
    SiVuedotjs,
    SiWebassembly,
    SiYaml,
    SiZig,
} from "react-icons/si";

import { cn } from "@/lib/utils";

type LanguageConfig = {
  Icon: IconType;
  bg: string;
  iconClass: string;
};

const LANGUAGE_MAP: Record<string, LanguageConfig> = {
  JavaScript: {
    Icon: SiJavascript,
    bg: "bg-[#F7DF1E]",
    iconClass: "text-[#323330]",
  },
  TypeScript: {
    Icon: SiTypescript,
    bg: "bg-[#3178C6]",
    iconClass: "text-white",
  },
  Python: {
    Icon: SiPython,
    bg: "bg-[#3776AB]",
    iconClass: "text-[#FFD43B]",
  },
  Go: {
    Icon: SiGo,
    bg: "bg-[#00ADD8]",
    iconClass: "text-white",
  },
  Rust: {
    Icon: SiRust,
    bg: "bg-[#000000]",
    iconClass: "text-[#DEA584]",
  },
  Java: {
    Icon: Code2,
    bg: "bg-[#ED8B00]",
    iconClass: "text-white",
  },
  "C++": {
    Icon: SiCplusplus,
    bg: "bg-[#00599C]",
    iconClass: "text-white",
  },
  C: {
    Icon: SiC,
    bg: "bg-[#A8B9CC]",
    iconClass: "text-[#283593]",
  },
  "C#": {
    Icon: Code2,
    bg: "bg-[#239120]",
    iconClass: "text-white",
  },
  PHP: {
    Icon: SiPhp,
    bg: "bg-[#777BB4]",
    iconClass: "text-white",
  },
  Ruby: {
    Icon: SiRuby,
    bg: "bg-[#CC342D]",
    iconClass: "text-white",
  },
  Kotlin: {
    Icon: SiKotlin,
    bg: "bg-[#7F52FF]",
    iconClass: "text-white",
  },
  Swift: {
    Icon: SiSwift,
    bg: "bg-[#F05138]",
    iconClass: "text-white",
  },
  Dart: {
    Icon: SiDart,
    bg: "bg-[#0175C2]",
    iconClass: "text-white",
  },
  HTML: {
    Icon: SiHtml5,
    bg: "bg-[#E34F26]",
    iconClass: "text-white",
  },
  CSS: {
    Icon: SiCss,
    bg: "bg-[#1572B6]",
    iconClass: "text-white",
  },
  Shell: {
    Icon: SiGnubash,
    bg: "bg-[#4EAA25]",
    iconClass: "text-white",
  },
  Markdown: {
    Icon: SiMarkdown,
    bg: "bg-[#083fa1]",
    iconClass: "text-white",
  },
};

interface LanguageIconProps {
  language?: string | null;
  className?: string;
  iconClassName?: string;
}

export function LanguageIcon({
  language,
  className,
  iconClassName,
}: LanguageIconProps) {
  const config = (language && LANGUAGE_MAP[language]) || {
    Icon: Code2,
    bg: "bg-muted",
    iconClass: "text-muted-foreground",
  };

  const IconComponent = config.Icon;

  return (
    <div
      className={cn(
        "flex size-6 items-center justify-center rounded-md text-xs",
        config.bg,
        className
      )}
    >
      <IconComponent className={cn("size-3.5", config.iconClass, iconClassName)} />
    </div>
  );
}