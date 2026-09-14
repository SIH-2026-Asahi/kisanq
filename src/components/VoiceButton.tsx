import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

export function VoiceButton({
  lang,
  onResult,
  label,
}: {
  lang: Lang;
  onResult: () => void;
  label?: string;
}) {
  const [listening, setListening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <button
      type="button"
      aria-label={label ?? t("speak", lang)}
      aria-pressed={listening}
      onClick={() => {
        if (listening) return;
        setListening(true);
        timer.current = setTimeout(() => {
          setListening(false);
          onResult();
        }, 1400);
      }}
      className={`grid size-12 shrink-0 place-items-center rounded-full border-2 transition-colors ${
        listening
          ? "animate-pulse border-gold bg-gold text-gold-foreground"
          : "border-brand/30 bg-brand-soft text-brand"
      }`}
    >
      <Mic className="size-6" aria-hidden />
      <span className="sr-only">{listening ? t("listening", lang) : t("speak", lang)}</span>
    </button>
  );
}
