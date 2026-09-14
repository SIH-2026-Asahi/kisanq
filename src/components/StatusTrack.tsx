import { CalendarCheck, Scale, BadgeCheck, IndianRupee, Check } from "lucide-react";
import { STATUS_ORDER, type TokenStatus, type Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

const ICONS = {
  scheduled: CalendarCheck,
  weighed: Scale,
  approved: BadgeCheck,
  paid: IndianRupee,
} as const;

export function StatusBadge({ status, lang }: { status: TokenStatus; lang: Lang }) {
  const Icon = ICONS[status];
  const tone =
    status === "paid"
      ? "bg-brand text-brand-foreground"
      : status === "approved"
        ? "bg-cap-high-soft text-cap-high"
        : status === "weighed"
          ? "bg-gold-soft text-gold-foreground"
          : "bg-secondary text-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${tone}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {t(status, lang)}
    </span>
  );
}

export function StatusTrack({ status, lang }: { status: TokenStatus; lang: Lang }) {
  const current = STATUS_ORDER.indexOf(status);
  return (
    <ol className="flex items-start justify-between gap-1">
      {STATUS_ORDER.map((s, i) => {
        const Icon = ICONS[s];
        const done = i <= current;
        return (
          <li key={s} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span
                className={`h-1 flex-1 rounded-full ${i === 0 ? "opacity-0" : i <= current ? "bg-brand" : "bg-border"}`}
              />
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full border-2 ${
                  done
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {i < current ? (
                  <Check className="size-5" aria-hidden />
                ) : (
                  <Icon className="size-5" aria-hidden />
                )}
              </span>
              <span
                className={`h-1 flex-1 rounded-full ${i === STATUS_ORDER.length - 1 ? "opacity-0" : i < current ? "bg-brand" : "bg-border"}`}
              />
            </div>
            <span
              className={`text-center text-xs font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}
            >
              {t(s, lang)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
