import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { ALL_INDIA_MANDIS, isoDate, makeCode } from "@/lib/data";
import type { Token } from "@/lib/types";
import type { AppState } from "@/lib/store";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const GREETING =
  "Namaste! 🌾 This is KisanQ on WhatsApp. Reply *Book Slot* to reserve a mandi token.";

export function WhatsAppDrawer({
  open,
  onClose,
  state,
  update,
}: {
  open: boolean;
  onClose: () => void;
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}) {
  const lang = state.lang;
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<"idle" | "center" | "done">("idle");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs, open]);

  function bot(text: string) {
    setMsgs((m) => [...m, { from: "bot", text }]);
  }

  function handle(raw: string) {
    const text = raw.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setInput("");
    const lower = text.toLowerCase();

    setTimeout(() => {
      if (stage === "idle" && lower.includes("book")) {
        setStage("center");
        bot(
          "Choose your procurement centre:\n" +
            ALL_INDIA_MANDIS.map((m, i) => `${i + 1}. ${m.name.en} (${m.distanceKm} km)`).join("\n"),
        );
        return;
      }
      if (stage === "center") {
        const idx = Number(lower.replace(/\D/g, "")) - 1;
        const mandi =
          ALL_INDIA_MANDIS[idx] ?? ALL_INDIA_MANDIS.find((m) => m.name.en.toLowerCase().includes(lower.split(" ")[0]!));
        if (!mandi) {
          bot("Sorry, I didn't get that. Reply with the centre number, e.g. *1*.");
          return;
        }
        const token: Token = {
          id: `wa-${Date.now()}`,
          code: makeCode(),
          farmerName: state.session?.name ?? "WhatsApp Kisan",
          phone: state.session?.phone ?? "9800000000",
          mandiId: mandi.id,
          date: isoDate(1),
          time: "10:00 - 11:30",
          crop: "wheat",
          quintals: 20,
          status: "scheduled",
          createdAt: Date.now(),
          channel: "whatsapp",
        };
        update((s) => ({ ...s, tokens: [token, ...s.tokens] }));
        setStage("done");
        bot(
          `✅ TOKEN CONFIRMED\nCode: ${token.code}\nCentre: ${mandi.name[lang]}\nDate: ${token.date}\nTime: ${token.time}\nCrop: Wheat, ${token.quintals} q\n\nShow this SMS or code at the gate. Reply *Status* anytime.`,
        );
        return;
      }
      if (lower.includes("status")) {
        const last = state.tokens[0];
        bot(last ? `Token ${last.code} is currently: ${last.status.toUpperCase()}.` : GREETING);
        return;
      }
      bot("Reply *Book Slot* to reserve a mandi token, or *Status* to track one.");
    }, 500);
  }

  const quick = stage === "center" ? ["1", "2", "3"] : ["Book Slot", "Status"];

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        aria-label="Close chat"
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="WhatsApp booking chat"
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-t-3xl bg-whatsapp px-4 py-3 text-white">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20">
            <MessageCircle className="size-6" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-bold">KisanQ Helpline</span>
            <span className="block truncate text-xs opacity-90">WhatsApp · online</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-12 shrink-0 place-items-center rounded-full hover:bg-white/15"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-secondary/60 p-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                m.from === "bot"
                  ? "bg-card text-foreground"
                  : "ml-auto bg-cap-high-soft text-foreground"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handle(q)}
              className="h-12 shrink-0 rounded-full border-2 border-brand px-4 text-sm font-bold text-brand"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handle(input);
          }}
          className="flex items-center gap-2 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            aria-label="Type a message"
            className="h-12 min-w-0 flex-1 rounded-full border-2 border-input bg-background px-4 outline-none focus-visible:border-brand"
          />
          <button
            type="submit"
            aria-label="Send"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-whatsapp text-white"
          >
            <Send className="size-5" aria-hidden />
          </button>
        </form>
      </div>
    </>
  );
}
