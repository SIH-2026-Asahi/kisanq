import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Plus,
  Tractor,
  Users,
} from "lucide-react";
import { CROPS, ALL_INDIA_MANDIS, PICKUP_AREAS, TIMES } from "@/lib/data";
import { shareOf, type Lang, type Pool, type Token } from "@/lib/types";
import { t } from "@/lib/i18n";
import type { AppState } from "@/lib/store";

function fmtDate(iso: string, lang: Lang) {
  const locale = lang === "hi" ? "hi-IN" : lang === "pa" ? "pa-IN" : "en-IN";
  return new Date(iso + "T12:00:00").toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function TractorPool({
  state,
  update,
  onBack,
  initialTokenId,
}: {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  onBack: () => void;
  initialTokenId?: string | undefined;
}) {
  const lang = state.lang;
  const phone = state.session?.phone ?? "";
  const myTokens = useMemo(
    () => state.tokens.filter((tk) => tk.phone === phone).sort((a, b) => b.createdAt - a.createdAt),
    [state.tokens, phone],
  );
  const [tokenId, setTokenId] = useState<string | null>(
    initialTokenId ?? myTokens[0]?.id ?? null,
  );
  const [creating, setCreating] = useState(false);
  const [area, setArea] = useState(PICKUP_AREAS[0]!);
  const [time, setTime] = useState("06:30");
  const [seats, setSeats] = useState(4);
  const [cost, setCost] = useState(1600);

  const token: Token | undefined = myTokens.find((tk) => tk.id === tokenId);

  const pools = state.pools.filter(
    (p) => token && p.mandiId === token.mandiId && p.date === token.date,
  );
  const isMember = (p: Pool) => p.members.some((m) => m.phone === phone);

  function join(pool: Pool) {
    if (!token || !state.session) return;
    update((s) => ({
      ...s,
      pools: s.pools.map((p) =>
        p.id === pool.id
          ? {
              ...p,
              members: [
                ...p.members,
                {
                  name: state.session!.name,
                  phone,
                  crop: token.crop,
                  quintals: token.quintals,
                },
              ],
            }
          : p,
      ),
    }));
  }

  function leave(pool: Pool) {
    update((s) => ({
      ...s,
      pools: s.pools.map((p) =>
        p.id === pool.id ? { ...p, members: p.members.filter((m) => m.phone !== phone) } : p,
      ),
    }));
  }

  function create() {
    if (!token || !state.session) return;
    const pool: Pool = {
      id: `pool-${Date.now()}`,
      mandiId: token.mandiId,
      date: token.date,
      ownerName: state.session.name,
      pickupArea: area,
      pickupTime: time,
      seats,
      tripCost: cost,
      members: [
        { name: state.session.name, phone, crop: token.crop, quintals: token.quintals },
      ],
    };
    update((s) => ({ ...s, pools: [pool, ...s.pools] }));
    setCreating(false);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex h-12 items-center gap-2 rounded-2xl px-1 font-semibold text-brand"
      >
        <ArrowLeft className="size-5" aria-hidden /> {t("back", lang)}
      </button>

      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/20 text-gold">
          <Tractor className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-black">{t("tractorPool", lang)}</h2>
          <p className="text-sm text-muted-foreground">{t("poolSub", lang)}</p>
        </div>
      </div>

      {myTokens.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-4 text-base font-semibold">
          {t("needBooking", lang)}
        </p>
      ) : (
        <>
          <h3 className="mb-2 text-sm font-bold">{t("selectBooking", lang)}</h3>
          <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
            {myTokens.map((tk) => {
              const m = ALL_INDIA_MANDIS.find((x) => x.id === tk.mandiId);
              return (
                <button
                  key={tk.id}
                  type="button"
                  aria-pressed={tokenId === tk.id}
                  onClick={() => setTokenId(tk.id)}
                  className={`min-h-14 shrink-0 rounded-2xl border-2 px-4 py-2 text-left ${
                    tokenId === tk.id ? "border-brand bg-brand-soft" : "border-border bg-card"
                  }`}
                >
                  <span className="block text-sm font-bold">{tk.code}</span>
                  <span className="block text-xs text-muted-foreground">
                    {m?.name[lang]} · {fmtDate(tk.date, lang)}
                  </span>
                </button>
              );
            })}
          </div>

          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Users className="size-5 text-brand" aria-hidden /> {t("availablePools", lang)}
          </h3>

          {pools.length === 0 && (
            <p className="mb-4 rounded-2xl border border-dashed border-border bg-card p-4 text-sm font-medium text-muted-foreground">
              {t("noPools", lang)}
            </p>
          )}

          <ul className="space-y-3">
            {pools.map((p) => {
              const mine = isMember(p);
              const full = p.members.length >= p.seats;
              const perHead = shareOf(mine ? p : { ...p, members: [...p.members, { name: "", phone: "" }] });
              return (
                <li
                  key={p.id}
                  className={`rounded-2xl border-2 bg-card p-4 ${
                    mine ? "border-brand" : "border-border"
                  }`}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold">{p.ownerName}</p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" aria-hidden /> {p.pickupArea}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="size-4 shrink-0" aria-hidden /> {p.pickupTime} ·{" "}
                        {fmtDate(p.date, lang)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        full && !mine
                          ? "bg-cap-busy-soft text-cap-busy"
                          : "bg-cap-high-soft text-cap-high"
                      }`}
                    >
                      {p.members.length}/{p.seats}
                    </span>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.members.map((m) => {
                      const c = CROPS.find((x) => x.id === m.crop);
                      return (
                        <li
                          key={m.phone}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold"
                        >
                          {m.name}
                          {c ? ` · ${c.emoji} ${m.quintals}q` : ""}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("tripCost", lang)}</p>
                      <p className="flex items-center font-bold">
                        <IndianRupee className="size-4" aria-hidden />
                        {p.tripCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("yourShare", lang)}</p>
                      <p className="flex items-center font-bold text-brand">
                        <IndianRupee className="size-4" aria-hidden />
                        {perHead}
                      </p>
                    </div>
                  </div>

                  {mine && (
                    <p className="mt-3 flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2 text-sm font-bold text-brand">
                      <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                      {t("poolConfirmed", lang)}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={!mine && full}
                    onClick={() => (mine ? leave(p) : join(p))}
                    className={`mt-3 h-14 w-full rounded-2xl text-base font-bold disabled:opacity-40 ${
                      mine
                        ? "border-2 border-border bg-background"
                        : "bg-brand text-brand-foreground"
                    }`}
                  >
                    {mine ? t("leavePool", lang) : full ? t("poolFull", lang) : t("joinPool", lang)}
                  </button>
                </li>
              );
            })}
          </ul>

          {!creating ? (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gold text-base font-black text-gold-foreground"
            >
              <Plus className="size-5" aria-hidden /> {t("createPool", lang)}
            </button>
          ) : (
            <div className="mt-5 rounded-2xl border-2 border-border bg-card p-4">
              <h3 className="mb-3 text-base font-bold">{t("createPool", lang)}</h3>

              <label className="mb-1 block text-sm font-semibold" htmlFor="pool-area">
                {t("pickupArea", lang)}
              </label>
              <select
                id="pool-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mb-3 h-14 w-full rounded-2xl border-2 border-input bg-background px-3 text-base"
              >
                {PICKUP_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <label className="mb-1 block text-sm font-semibold" htmlFor="pool-time">
                {t("pickupTime", lang)}
              </label>
              <select
                id="pool-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mb-3 h-14 w-full rounded-2xl border-2 border-input bg-background px-3 text-base"
              >
                {["05:30", "06:30", "07:30", ...TIMES.map((x) => x.slice(0, 5))].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold" htmlFor="pool-seats">
                    {t("seats", lang)}
                  </label>
                  <input
                    id="pool-seats"
                    inputMode="numeric"
                    value={seats}
                    onChange={(e) =>
                      setSeats(Math.max(2, Number(e.target.value.replace(/\D/g, "")) || 2))
                    }
                    className="h-14 w-full rounded-2xl border-2 border-input bg-background text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold" htmlFor="pool-cost">
                    {t("tripCost", lang)}
                  </label>
                  <input
                    id="pool-cost"
                    inputMode="numeric"
                    value={cost}
                    onChange={(e) =>
                      setCost(Math.max(100, Number(e.target.value.replace(/\D/g, "")) || 100))
                    }
                    className="h-14 w-full rounded-2xl border-2 border-input bg-background text-center text-lg font-bold"
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="h-14 flex-1 rounded-2xl border-2 border-border bg-background text-base font-bold"
                >
                  {t("back", lang)}
                </button>
                <button
                  type="button"
                  onClick={create}
                  className="h-14 flex-1 rounded-2xl bg-brand text-base font-bold text-brand-foreground"
                >
                  {t("createPool", lang)}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
