import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  CloudOff,
  RefreshCw,
  ScanLine,
  Timer,
  Users,
  Weight,
  CheckCircle2,
  QrCode,
  History,
} from "lucide-react";
import { MANDIS, CROPS, isoDate } from "@/lib/data";
import { STATUS_ORDER, type Token, type TokenStatus } from "@/lib/types";
import { t } from "@/lib/i18n";
import type { AppState } from "@/lib/store";
import { StatusBadge } from "./StatusTrack";

const MANDI_ID = "m1";

function nextStatus(s: TokenStatus): TokenStatus {
  const i = STATUS_ORDER.indexOf(s);
  return STATUS_ORDER[Math.min(i + 1, STATUS_ORDER.length - 1)]!;
}

/** Parses the payload encoded in a farmer's token QR code and resolves it to a Token. */
function resolveScannedToken(raw: string, tokens: Token[]): Token | undefined {
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as { tokenId?: string; code?: string };
    if (parsed && (parsed.tokenId || parsed.code)) {
      return (
        tokens.find((tk) => tk.id === parsed.tokenId) ??
        tokens.find((tk) => tk.code === parsed.code)
      );
    }
  } catch {
    /* not JSON — fall back to treating it as a raw token id/code */
  }
  return (
    tokens.find((tk) => tk.id === trimmed) ??
    tokens.find((tk) => tk.code.toLowerCase() === trimmed.toLowerCase())
  );
}

export function AdminDashboard({
  state,
  update,
}: {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
}) {
  const lang = state.lang;
  const mandi = MANDIS.find((m) => m.id === MANDI_ID)!;
  const today = isoDate(0);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [offline, setOffline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => () => stopCamera(), []);

  const queue = useMemo(
    () =>
      state.tokens
        .filter((tk) => tk.date === today || tk.mandiId === MANDI_ID)
        .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)),
    [state.tokens, today],
  );

  const waiting = queue.filter((tk) => tk.status === "scheduled").length;
  const checkedIn = queue.filter((tk) => tk.checkedInAt).length;
  const completed = queue.filter((tk) => tk.status === "paid").length;
  const quintalsToday = queue.reduce((sum, tk) => sum + tk.quintals, 0);
  const avgWait = waiting * 7 + 5;
  const utilisation = Math.min(100, Math.round((quintalsToday / mandi.dailyCapacity) * 100));

  function stopCamera() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }

  function tick() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(frame.data, frame.width, frame.height);
    if (result?.data) {
      handleScan(result.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  async function startScan() {
    if (scanning) return;
    setScanError(null);
    setScanned(null);
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setScanning(false);
      setScanError("Camera unavailable — enter the token code below instead.");
    }
  }

  function stopScan() {
    stopCamera();
    setScanning(false);
  }

  /** Records a real QR (or manually entered) scan against the token queue and notifies the admin view. */
  function handleScan(raw: string) {
    stopCamera();
    setScanning(false);
    const target = resolveScannedToken(raw, state.tokens);
    if (!target) {
      setScanError("QR not recognised for this centre — check the token code.");
      return;
    }
    setScanError(null);
    setScanned(target.id);
    const statusAfter = nextStatus(target.status);
    update((s) => ({
      ...s,
      offlineQueue: offline ? s.offlineQueue + 1 : s.offlineQueue,
      tokens: s.tokens.map((tk) =>
        tk.id === target.id
          ? { ...tk, status: statusAfter, checkedInAt: tk.checkedInAt ?? Date.now() }
          : tk,
      ),
      scans: [
        {
          id: `scan_${Date.now()}`,
          tokenId: target.id,
          code: target.code,
          farmerName: target.farmerName,
          mandiId: target.mandiId,
          scannedAt: Date.now(),
          statusAfter,
        },
        ...s.scans,
      ].slice(0, 50),
    }));
  }

  function advance(id: string) {
    update((s) => ({
      ...s,
      offlineQueue: offline ? s.offlineQueue + 1 : s.offlineQueue,
      tokens: s.tokens.map((tk) =>
        tk.id === id
          ? { ...tk, status: nextStatus(tk.status), checkedInAt: tk.checkedInAt ?? Date.now() }
          : tk,
      ),
    }));
  }

  function sync() {
    setSyncing(true);
    timers.current.push(
      setTimeout(() => {
        setSyncing(false);
        setOffline(false);
        update((s) => ({ ...s, offlineQueue: 0 }));
      }, 1400),
    );
  }

  const stats = [
    { icon: Users, label: "In queue", value: String(waiting), tone: "text-brand" },
    { icon: Timer, label: "Avg wait", value: `${avgWait} min`, tone: "text-gold-foreground" },
    { icon: Weight, label: "Quintals", value: String(quintalsToday), tone: "text-brand" },
    { icon: CheckCircle2, label: "Paid out", value: String(completed), tone: "text-cap-high" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-4">
      {(offline || state.offlineQueue > 0) && (
        <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border-2 border-gold/50 bg-gold-soft p-3">
          <CloudOff className="size-6 shrink-0 text-gold-foreground" aria-hidden />
          <p className="min-w-0 text-sm font-semibold text-gold-foreground">
            Offline mode · {state.offlineQueue} update{state.offlineQueue === 1 ? "" : "s"} cached
            locally
          </p>
          <button
            type="button"
            onClick={sync}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground"
          >
            <RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} aria-hidden />
            {syncing ? "Syncing" : "Batch sync"}
          </button>
        </div>
      )}

      <header className="mb-4">
        <h2 className="text-xl font-bold">{mandi.name[lang]}</h2>
        <p className="text-sm text-muted-foreground">
          {mandi.district[lang]} · {checkedIn} checked in today
        </p>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <s.icon className={`size-5 ${s.tone}`} aria-hidden />
            <p className="mt-2 text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold">
          <span>Daily capacity used</span>
          <span>
            {quintalsToday} / {mandi.dailyCapacity} q
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={utilisation}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Daily capacity used"
        >
          <div
            className={`h-full rounded-full ${utilisation > 85 ? "bg-cap-busy" : utilisation > 50 ? "bg-cap-mod" : "bg-cap-high"}`}
            style={{ width: `${utilisation}%` }}
          />
        </div>
      </div>

      {/* Scanner */}
      <section className="mb-6 rounded-3xl border border-border bg-card p-4" aria-label="QR scanner">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <QrCode className="size-5 text-brand" aria-hidden /> Token scanner
        </h3>
        <div className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-2xl bg-[oklch(0.22_0.03_152)] text-white/70">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`absolute inset-0 h-full w-full object-cover ${scanning ? "opacity-100" : "opacity-0"}`}
          />
          <canvas ref={canvasRef} className="hidden" aria-hidden />
          <div className="absolute inset-6 rounded-xl border-4 border-white/30" />
          {scanning && (
            <div className="absolute inset-x-6 top-6 h-1 animate-[scanline_1.4s_ease-in-out_infinite] bg-gold" />
          )}
          {!scanning && (
            <p className="z-10 px-6 text-center text-sm font-semibold">
              Point camera at farmer's token QR
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={scanning ? stopScan : startScan}
          className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-lg font-bold text-brand-foreground"
        >
          <ScanLine className="size-6" aria-hidden /> {scanning ? "Stop camera" : "Scan QR"}
        </button>

        <div className="mt-3 flex gap-2">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Or enter token code (e.g. KQ-1042)"
            className="h-12 min-w-0 flex-1 rounded-xl border-2 border-input bg-background px-3 text-sm outline-none focus-visible:border-brand"
          />
          <button
            type="button"
            onClick={() => {
              if (manualCode.trim()) handleScan(manualCode.trim());
              setManualCode("");
            }}
            className="h-12 shrink-0 rounded-xl border-2 border-brand px-4 text-sm font-bold text-brand"
          >
            Check
          </button>
        </div>

        {scanError && (
          <p className="mt-3 rounded-xl bg-cap-busy-soft p-3 text-sm font-semibold text-cap-busy">
            {scanError}
          </p>
        )}
        {scanned && !scanning && !scanError && (
          <p className="mt-3 rounded-xl bg-cap-high-soft p-3 text-sm font-semibold text-cap-high">
            {state.tokens.find((tk) => tk.id === scanned)?.farmerName} ·{" "}
            {state.tokens.find((tk) => tk.id === scanned)?.code} advanced to{" "}
            {t(state.tokens.find((tk) => tk.id === scanned)?.status ?? "scheduled", lang)}
          </p>
        )}
      </section>

      {state.scans.length > 0 && (
        <section className="mb-6 rounded-3xl border border-border bg-card p-4" aria-label="Recent scans">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <History className="size-5 text-brand" aria-hidden /> Recent scans
          </h3>
          <ul className="space-y-2">
            {state.scans.slice(0, 5).map((scan) => (
              <li
                key={scan.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{scan.farmerName}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {scan.code} · {new Date(scan.scannedAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
                <StatusBadge status={scan.statusAfter} lang={lang} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <h3 className="mb-3 text-lg font-bold">Live queue</h3>
      <ul className="space-y-3">
        {queue.map((tk, i) => {
          const cropDef = CROPS.find((c) => c.id === tk.crop);
          return (
            <li
              key={tk.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-black text-brand">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{tk.farmerName}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {tk.code} · {cropDef?.emoji} {cropDef ? cropDef[lang] : tk.crop} · {tk.quintals}q
                    · {tk.time}
                  </span>
                </span>
                <StatusBadge status={tk.status} lang={lang} />
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="min-w-0 truncate text-xs font-semibold text-muted-foreground">
                  {tk.checkedInAt
                    ? `Checked in ${Math.max(1, Math.round((Date.now() - tk.checkedInAt) / 60000))} min ago`
                    : "Not checked in"}
                  {tk.channel === "whatsapp" ? " · via WhatsApp" : ""}
                </span>
                <button
                  type="button"
                  disabled={tk.status === "paid"}
                  onClick={() => advance(tk.id)}
                  className="h-12 shrink-0 rounded-xl border-2 border-brand px-4 text-sm font-bold text-brand disabled:opacity-40"
                >
                  {tk.status === "paid" ? "Done" : `Mark ${t(nextStatus(tk.status), lang)}`}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
