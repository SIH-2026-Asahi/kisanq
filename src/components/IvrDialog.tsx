import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Headphones,
  Info,
  PhoneCall,
  PhoneOff,
  Ticket,
  X,
} from "lucide-react";
import { LANGS, t } from "@/lib/i18n";
import type { Lang, Token } from "@/lib/types";
import { MANDIS } from "@/lib/data";

export const CARE_NUMBER = "1800-180-KISAN";

type Stage = "lang" | "connecting" | "menu" | "detail";

const OPTIONS = [
  { id: "status", key: "ivrBookingStatus", icon: Ticket },
  { id: "slot", key: "ivrSlotHelp", icon: Info },
  { id: "pay", key: "ivrPayment", icon: CreditCard },
  { id: "agent", key: "ivrAgent", icon: Headphones },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

export function IvrDialog({
  open,
  onClose,
  lang,
  token,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  token?: Token | undefined;
}) {
  const [stage, setStage] = useState<Stage>("lang");
  const [callLang, setCallLang] = useState<Lang>(lang);
  const [choice, setChoice] = useState<OptionId | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!open) {
      setStage("lang");
      setChoice(null);
      setSeconds(0);
      setCallLang(lang);
    }
  }, [open, lang]);

  useEffect(() => {
    if (stage !== "connecting") return;
    const id = setTimeout(() => setStage("menu"), 1600);
    return () => clearTimeout(id);
  }, [stage]);

  useEffect(() => {
    if (stage === "lang" || !open) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [stage, open]);

  if (!open) return null;

  const l = callLang;
  const mandi = token ? MANDIS.find((m) => m.id === token.mandiId) : undefined;
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  function detailBody() {
    if (choice === "status") {
      return token
        ? `${t("yourToken", l)}: ${token.code} · ${t("mandi", l)}: ${mandi?.name[l] ?? "—"} · ${t("slot", l)}: ${token.date} ${token.time} · ${t(token.status, l)}`
        : t("needBooking", l);
    }
    if (choice === "slot") return t("chooseSlot", l) + " — " + t("poolSub", l);
    if (choice === "pay")
      return token
        ? `${token.code}: ${t(token.status, l)} · ${token.quintals} q`
        : t("needBooking", l);
    return t("callbackQueued", l);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("callbackCta", l)}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-xl sm:rounded-3xl"
      >
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
              <PhoneCall className="size-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black">{t("helpline", l)}</p>
              <p className="truncate text-sm text-muted-foreground">{CARE_NUMBER}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("endCall", l)}
            className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-border"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <p className="mb-4 rounded-2xl bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground">
          {t("demoOnly", l)}
        </p>

        {stage === "lang" && (
          <div>
            <h3 className="mb-3 text-base font-bold">{t("chooseLanguage", l)}</h3>
            <div className="space-y-3">
              {LANGS.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    setCallLang(opt.code);
                    setStage("connecting");
                  }}
                  className="flex h-14 w-full items-center justify-between rounded-2xl border-2 border-border bg-background px-4 text-base font-bold hover:border-brand"
                >
                  {opt.label}
                  <span className="text-sm text-muted-foreground">{opt.short}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "connecting" && (
          <div className="py-10 text-center">
            <span className="mx-auto grid size-20 animate-pulse place-items-center rounded-full bg-brand text-brand-foreground">
              <PhoneCall className="size-9" aria-hidden />
            </span>
            <p className="mt-4 text-lg font-bold">{t("connecting", l)}</p>
            <p className="text-sm text-muted-foreground">{CARE_NUMBER}</p>
          </div>
        )}

        {(stage === "menu" || stage === "detail") && (
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand">
              <span className="size-2.5 animate-pulse rounded-full bg-cap-high" aria-hidden />
              {t("ivrMenu", l)} · {clock}
            </p>

            {stage === "menu" ? (
              <ul className="space-y-3">
                {OPTIONS.map((o, i) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setChoice(o.id);
                        setStage("detail");
                      }}
                      className="grid min-h-14 w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border-2 border-border bg-background px-4 py-3 text-left hover:border-brand"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-base font-black text-brand">
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-base font-bold">
                          <o.icon className="size-4 shrink-0 text-brand" aria-hidden />
                          <span className="truncate">{t(o.key, l)}</span>
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {t("ivrPress", l)} {i + 1}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border-2 border-brand/30 bg-brand-soft p-4">
                <p className="flex items-center gap-2 text-base font-bold text-brand">
                  <CheckCircle2 className="size-5 shrink-0" aria-hidden />
                  {t(OPTIONS.find((o) => o.id === choice)!.key, l)}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">{detailBody()}</p>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              {stage === "detail" && (
                <button
                  type="button"
                  onClick={() => setStage("menu")}
                  className="h-14 flex-1 rounded-2xl border-2 border-border bg-background text-base font-bold"
                >
                  {t("ivrMain", l)}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-cap-busy text-base font-bold text-white"
              >
                <PhoneOff className="size-5" aria-hidden /> {t("endCall", l)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
