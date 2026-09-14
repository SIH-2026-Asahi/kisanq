import { useState } from "react";
import { LogOut, MessageCircle, Sprout, Store, User } from "lucide-react";
import { useAppState } from "@/lib/store";
import { LANGS, t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { FarmerPortal } from "@/components/FarmerPortal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { WhatsAppDrawer } from "@/components/WhatsAppDrawer";

export default function App() {
  const [state, update] = useAppState();
  const [view, setView] = useState<"farmer" | "admin">("farmer");
  const [chatOpen, setChatOpen] = useState(false);
  const lang = state.lang;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand text-brand-foreground">
              <Sprout className="size-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black leading-tight">{t("appName", lang)}</h1>
              <p className="truncate text-xs text-muted-foreground">{t("tagline", lang)}</p>
            </div>
          </div>
          <div
            className="flex max-w-full shrink-0 gap-1 overflow-x-auto rounded-full bg-secondary p-1"
            role="group"
            aria-label="Language"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                aria-pressed={lang === l.code}
                onClick={() => update((s) => ({ ...s, lang: l.code as Lang }))}
                className={`h-10 min-w-11 shrink-0 rounded-full px-2 text-sm font-bold ${
                  lang === l.code ? "bg-brand text-brand-foreground" : "text-muted-foreground"
                }`}
              >
                {l.short}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 pb-3">
          <div className="grid flex-1 grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            {(
              [
                { id: "farmer", icon: User, label: t("farmer", lang) },
                { id: "admin", icon: Store, label: t("admin", lang) },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={view === tab.id}
                onClick={() => setView(tab.id)}
                className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold ${
                  view === tab.id ? "bg-card text-brand shadow-sm" : "text-muted-foreground"
                }`}
              >
                <tab.icon className="size-5 shrink-0" aria-hidden />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
          {state.session && view === "farmer" && (
            <button
              type="button"
              onClick={() => update((s) => ({ ...s, session: null }))}
              aria-label={t("logout", lang)}
              className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-border bg-card"
            >
              <LogOut className="size-5" aria-hidden />
            </button>
          )}
        </div>
      </header>

      <main>
        {view === "farmer" ? (
          <FarmerPortal state={state} update={update} />
        ) : (
          <AdminDashboard state={state} update={update} />
        )}
      </main>

      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label={t("whatsapp", lang)}
        className="fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-whatsapp px-5 text-base font-bold text-white shadow-lg"
      >
        <MessageCircle className="size-6" aria-hidden />
        <span className="hidden sm:inline">{t("whatsapp", lang)}</span>
      </button>

      <WhatsAppDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        state={state}
        update={update}
      />
    </div>
  );
}
