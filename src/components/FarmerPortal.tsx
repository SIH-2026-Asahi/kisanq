import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  Phone,
  PhoneCall,
  Sprout,
  Ticket,
  Tractor,
  Wheat,
} from "lucide-react";
import { ALL_INDIA_MANDIS, CROPS, buildSlots, makeCode, INDIA_STATES_AND_CITIES } from "@/lib/data";
import { capacityOf, type Lang, type Slot, type Token } from "@/lib/types";
import { t } from "@/lib/i18n";
import type { AppState } from "@/lib/store";
import { Qr } from "./Qr";
import { StatusBadge, StatusTrack } from "./StatusTrack";
import { VoiceButton } from "./VoiceButton";
import { CARE_NUMBER, IvrDialog } from "./IvrDialog";
import { TractorPool } from "./TractorPool";

const DEMO_OTP = "4321";

const CAP_STYLES = {
  high: "border-cap-high/40 bg-cap-high-soft text-cap-high",
  moderate: "border-cap-mod/40 bg-cap-mod-soft text-cap-mod",
  congested: "border-cap-busy/40 bg-cap-busy-soft text-cap-busy",
} as const;

const CAP_DOT = {
  high: "bg-cap-high",
  moderate: "bg-cap-mod",
  congested: "bg-cap-busy",
} as const;

function fmtDate(iso: string, lang: Lang) {
  const locale = lang === "hi" ? "hi-IN" : lang === "pa" ? "pa-IN" : "en-IN";
  return new Date(iso + "T12:00:00").toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function FarmerPortal({
  state,
  update,
}: {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}) {
  const lang = state.lang;
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [mandiId, setMandiId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [crop, setCrop] = useState("wheat");
  const [quintals, setQuintals] = useState(25);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [ivrOpen, setIvrOpen] = useState(false);
  const [poolFor, setPoolFor] = useState<string | null>(null);
  const [poolOpen, setPoolOpen] = useState(false);

  const slots = useMemo(() => (mandiId ? buildSlots(mandiId) : []), [mandiId]);
  const dates = useMemo(() => Array.from(new Set(slots.map((s) => s.date))), [slots]);
  const [date, setDate] = useState<string | null>(null);
  const activeDate = date ?? dates[0] ?? null;
  const daySlots = slots.filter((s) => s.date === activeDate);

  const myTokens = state.tokens
    .filter((tk) => state.session && tk.phone === state.session.phone)
    .sort((a, b) => b.createdAt - a.createdAt);
  const shownToken = activeToken ? state.tokens.find((tk) => tk.id === activeToken) : undefined;


  const helpCard = (
    <div className="mt-6 rounded-3xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Phone className="size-4 text-brand" aria-hidden /> {t("helpline", lang)}
      </p>
      <p className="mt-1 text-2xl font-black tracking-wide text-brand">{CARE_NUMBER}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("demoOnly", lang)}</p>
      <button
        type="button"
        onClick={() => setIvrOpen(true)}
        className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-base font-bold text-brand-foreground"
      >
        <PhoneCall className="size-5" aria-hidden /> {t("callbackCta", lang)}
      </button>
    </div>
  );

  const ivr = (
    <IvrDialog
      open={ivrOpen}
      onClose={() => setIvrOpen(false)}
      lang={lang}
      token={shownToken ?? myTokens[0]}
    />
  );

  /* ---------------- Tractor pool ---------------- */
  if (poolOpen && state.session) {
    return (
      <TractorPool
        state={state}
        update={update}
        onBack={() => setPoolOpen(false)}
        initialTokenId={poolFor ?? undefined}
      />
    );
  }

  /* ---------------- Login ---------------- */
  if (!state.session) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Smartphone className="size-6" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold">{t("login", lang)}</h2>
              <p className="text-sm text-muted-foreground">{t("tagline", lang)}</p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-semibold" htmlFor="phone">
            {t("phone", lang)}
          </label>
          <div className="flex gap-2">
            <input
              id="phone"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-input bg-background px-4 text-lg tracking-wide outline-none focus-visible:border-brand"
            />
            <VoiceButton lang={lang} onResult={() => setPhone("9876543210")} />
          </div>

          {!otpSent ? (
            <button
              type="button"
              disabled={phone.length !== 10}
              onClick={() => {
                setOtpSent(true);
                setTimeout(() => setOtp(DEMO_OTP), 700);
              }}
              className="mt-5 h-14 w-full rounded-2xl bg-brand text-lg font-bold text-brand-foreground disabled:opacity-40"
            >
              {t("sendOtp", lang)}
            </button>
          ) : (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold" htmlFor="otp">
                {t("enterOtp", lang)}
              </label>
              <input
                id="otp"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="h-14 w-full rounded-2xl border-2 border-input bg-background px-4 text-center text-2xl font-bold tracking-[0.6em] outline-none focus-visible:border-brand"
              />
              <p className="mt-2 flex items-center gap-1.5 text-sm text-brand">
                <ShieldCheck className="size-4" aria-hidden /> {t("demoOtp", lang)} · {DEMO_OTP}
              </p>
              <label className="mb-2 mt-4 block text-sm font-semibold" htmlFor="name">
                {t("yourName", lang)}
              </label>
              <div className="flex gap-2">
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Gurpreet Singh"
                  className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-input bg-background px-4 text-lg outline-none focus-visible:border-brand"
                />
                <VoiceButton lang={lang} onResult={() => setName("Gurpreet Singh")} />
              </div>
              <button
                type="button"
                disabled={otp !== DEMO_OTP}
                onClick={() =>
                  update((s) => ({
                    ...s,
                    session: { name: name.trim() || "Kisan", phone },
                  }))
                }
                className="mt-5 h-14 w-full rounded-2xl bg-brand text-lg font-bold text-brand-foreground disabled:opacity-40"
              >
                {t("verify", lang)}
              </button>
            </div>
          )}
        </div>
        {helpCard}
        {ivr}
      </div>
    );
  }

  /* ---------------- Token view ---------------- */
  if (shownToken) {
    const mandi = ALL_INDIA_MANDIS.find((m) => m.id === shownToken.mandiId)!;
    const cropDef = CROPS.find((c) => c.id === shownToken.crop);
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
        <button
          type="button"
          onClick={() => setActiveToken(null)}
          className="mb-4 inline-flex h-12 items-center gap-2 rounded-2xl px-3 font-semibold text-brand"
        >
          <ArrowLeft className="size-5" aria-hidden /> {t("back", lang)}
        </button>
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="bg-brand px-5 py-4 text-brand-foreground">
            <p className="text-sm opacity-90">{t("yourToken", lang)}</p>
            <p className="text-3xl font-black tracking-wide">{shownToken.code}</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-5">
            <div className="rounded-2xl border-4 border-brand/15 p-2">
              <Qr
                value={JSON.stringify({
                  app: "KisanQ",
                  tokenId: shownToken.id,
                  code: shownToken.code,
                  mandiId: shownToken.mandiId,
                  farmerName: shownToken.farmerName,
                  phone: shownToken.phone,
                  crop: shownToken.crop,
                  quintals: shownToken.quintals,
                  date: shownToken.date,
                  time: shownToken.time,
                })}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{t("showQr", lang)}</p>
            <StatusBadge status={shownToken.status} lang={lang} />
          </div>
          <div className="border-t border-dashed border-border px-5 py-5">
            <StatusTrack status={shownToken.status} lang={lang} />
          </div>
          <dl className="grid grid-cols-2 gap-3 border-t border-border p-5 text-sm">
            <div className="min-w-0">
              <dt className="text-muted-foreground">{t("mandi", lang)}</dt>
              <dd className="font-semibold">{mandi.name[lang]}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-muted-foreground">{t("slot", lang)}</dt>
              <dd className="font-semibold">
                {fmtDate(shownToken.date, lang)} · {shownToken.time}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-muted-foreground">{t("cropType", lang)}</dt>
              <dd className="font-semibold">
                {cropDef?.emoji} {cropDef ? cropDef[lang] : shownToken.crop}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-muted-foreground">{t("quintals", lang)}</dt>
              <dd className="font-semibold">{shownToken.quintals} q</dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          onClick={() => {
            setPoolFor(shownToken.id);
            setPoolOpen(true);
          }}
          className="mt-4 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border-2 border-gold/50 bg-gold/10 p-4 text-left"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground">
            <Tractor className="size-6" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black">{t("tractorPool", lang)}</span>
            <span className="block truncate text-sm text-muted-foreground">
              {t("poolSub", lang)}
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        </button>

        {helpCard}
        {ivr}
      </div>
    );
  }

  /* ---------------- Booking flow ---------------- */
  const selectedSlot: Slot | undefined = daySlots.find((s) => s.id === slotId);
  const selectedMandi = ALL_INDIA_MANDIS.find((m) => m.id === mandiId);
  const filtered = ALL_INDIA_MANDIS.filter((m) => {
    const locationMatch =
      (!selectedState || m.state === selectedState) &&
      (!selectedCity || m.city === selectedCity);
    const textMatch = (m.name[lang] + m.district[lang] + m.name.en + m.district.en + m.city + m.state)
      .toLowerCase()
      .includes(query.toLowerCase());
    return locationMatch && textMatch;
  });

  function confirm() {
    if (!selectedSlot || !mandiId || !state.session) return;
    const token: Token = {
      id: `tk-${Date.now()}`,
      code: makeCode(),
      farmerName: state.session.name,
      phone: state.session.phone,
      mandiId,
      date: selectedSlot.date,
      time: selectedSlot.time,
      crop,
      quintals,
      status: "scheduled",
      createdAt: Date.now(),
      channel: "app",
    };
    update((s) => ({ ...s, tokens: [token, ...s.tokens] }));
    setActiveToken(token.id);
    setStep(1);
    setMandiId(null);
    setSlotId(null);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
      {/* stepper */}
      <ol className="mb-4 flex items-center gap-2" aria-label="Booking steps">
        {[1, 2, 3].map((n) => (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                step >= n ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {step > n ? <Check className="size-4" aria-hidden /> : n}
            </span>
            <span className={`h-1 flex-1 rounded-full ${step > n ? "bg-brand" : "bg-border"}`} />
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section aria-label={t("chooseMandi", lang)}>
          <h2 className="mb-3 text-xl font-bold">{t("chooseMandi", lang)}</h2>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
              aria-label={t("selectState", lang)}
              className="h-12 rounded-2xl border-2 border-input bg-card px-3 text-sm font-semibold outline-none focus-visible:border-brand"
            >
              <option value="">{t("allIndia", lang)} · {t("selectState", lang)}</option>
              {Object.keys(INDIA_STATES_AND_CITIES).map((stateName) => (
                <option key={stateName} value={stateName}>{stateName}</option>
              ))}
            </select>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
              aria-label={t("selectCity", lang)}
              className="h-12 rounded-2xl border-2 border-input bg-card px-3 text-sm font-semibold outline-none focus-visible:border-brand disabled:opacity-50"
            >
              <option value="">{t("selectCity", lang)}</option>
              {(INDIA_STATES_AND_CITIES[selectedState] ?? []).map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          </div>
          <div className="mb-3 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchMandi", lang)}
                aria-label={t("searchMandi", lang)}
                className="h-14 w-full rounded-2xl border-2 border-input bg-card pl-12 pr-4 text-base outline-none focus-visible:border-brand"
              />
            </div>
            <VoiceButton lang={lang} onResult={() => setQuery("Khanna")} />
          </div>
          <ul className="space-y-3">
            {filtered.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMandiId(m.id);
                    setDate(null);
                    setSlotId(null);
                    setStep(2);
                  }}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-brand"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <MapPin className="size-6" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-bold">{m.name[lang]}</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {m.district[lang]} · {m.distanceKm} {t("km", lang)}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          {myTokens.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Ticket className="size-5 text-brand" aria-hidden /> {t("myTokens", lang)}
              </h3>
              <ul className="space-y-2">
                {myTokens.map((tk) => (
                  <li key={tk.id}>
                    <button
                      type="button"
                      onClick={() => setActiveToken(tk.id)}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-bold">{tk.code}</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {fmtDate(tk.date, lang)} · {tk.time}
                        </span>
                      </span>
                      <StatusBadge status={tk.status} lang={lang} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setPoolFor(null);
              setPoolOpen(true);
            }}
            className="mt-6 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border-2 border-gold/50 bg-gold/10 p-4 text-left"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold text-gold-foreground">
              <Tractor className="size-6" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black">{t("tractorPool", lang)}</span>
              <span className="block truncate text-sm text-muted-foreground">
                {t("poolSub", lang)}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          </button>

          {helpCard}
        </section>
      )}

      {step === 2 && selectedMandi && (
        <section aria-label={t("chooseSlot", lang)}>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-3 inline-flex h-12 items-center gap-2 font-semibold text-brand"
          >
            <ArrowLeft className="size-5" aria-hidden /> {t("back", lang)}
          </button>
          <h2 className="text-xl font-bold">{t("chooseSlot", lang)}</h2>
          <p className="mb-3 truncate text-sm text-muted-foreground">{selectedMandi.name[lang]}</p>

          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {dates.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDate(d);
                  setSlotId(null);
                }}
                className={`h-14 shrink-0 rounded-2xl border-2 px-4 text-sm font-bold ${
                  activeDate === d
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-card"
                }`}
              >
                {fmtDate(d, lang)}
              </button>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold">
            {(["high", "moderate", "congested"] as const).map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <span className={`size-3 rounded-full ${CAP_DOT[c]}`} aria-hidden />
                {t(c, lang)}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {daySlots.map((s) => {
              const cap = capacityOf(s);
              const full = s.booked >= s.capacity;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={full}
                  aria-pressed={slotId === s.id}
                  onClick={() => setSlotId(s.id)}
                  className={`min-h-[84px] rounded-2xl border-2 p-3 text-left ${CAP_STYLES[cap]} ${
                    slotId === s.id ? "ring-4 ring-brand/40" : ""
                  } ${full ? "opacity-50" : ""}`}
                >
                  <span className="block text-base font-bold text-foreground">{s.time}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                    <span className={`size-2.5 rounded-full ${CAP_DOT[cap]}`} aria-hidden />
                    {t(cap, lang)}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {s.capacity - s.booked} / {s.capacity}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!slotId}
            onClick={() => setStep(3)}
            className="mt-5 h-14 w-full rounded-2xl bg-brand text-lg font-bold text-brand-foreground disabled:opacity-40"
          >
            {t("cropDetails", lang)}
          </button>
        </section>
      )}

      {step === 3 && selectedSlot && selectedMandi && (
        <section aria-label={t("cropDetails", lang)}>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mb-3 inline-flex h-12 items-center gap-2 font-semibold text-brand"
          >
            <ArrowLeft className="size-5" aria-hidden /> {t("back", lang)}
          </button>
          <h2 className="mb-3 text-xl font-bold">{t("cropDetails", lang)}</h2>

          <p className="mb-2 text-sm font-semibold">{t("cropType", lang)}</p>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {CROPS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={crop === c.id}
                onClick={() => setCrop(c.id)}
                className={`min-h-[88px] rounded-2xl border-2 p-2 text-center ${
                  crop === c.id ? "border-brand bg-brand-soft" : "border-border bg-card"
                }`}
              >
                <span className="block text-2xl" aria-hidden>
                  {c.emoji}
                </span>
                <span className="mt-1 block text-sm font-bold">{c[lang]}</span>
              </button>
            ))}
          </div>

          <label htmlFor="q" className="mb-2 block text-sm font-semibold">
            {t("quintals", lang)}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="minus 5 quintals"
              onClick={() => setQuintals((q) => Math.max(1, q - 5))}
              className="size-14 shrink-0 rounded-2xl border-2 border-border bg-card text-2xl font-bold"
            >
              −
            </button>
            <input
              id="q"
              inputMode="numeric"
              value={quintals}
              onChange={(e) => setQuintals(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))}
              className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-input bg-card text-center text-xl font-bold outline-none focus-visible:border-brand"
            />
            <button
              type="button"
              aria-label="plus 5 quintals"
              onClick={() => setQuintals((q) => q + 5)}
              className="size-14 shrink-0 rounded-2xl border-2 border-border bg-card text-2xl font-bold"
            >
              +
            </button>
            <VoiceButton lang={lang} onResult={() => setQuintals(40)} />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm">
            <p className="flex items-center gap-2 font-bold">
              <Wheat className="size-4 text-brand" aria-hidden /> {selectedMandi.name[lang]}
            </p>
            <p className="mt-1 text-muted-foreground">
              {fmtDate(selectedSlot.date, lang)} · {selectedSlot.time}
            </p>
          </div>

          <button
            type="button"
            onClick={confirm}
            className="mt-5 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-gold text-lg font-black text-gold-foreground"
          >
            <Sprout className="size-6" aria-hidden /> {t("confirmBooking", lang)}
          </button>
        </section>
      )}
      {ivr}
    </div>
  );
}
