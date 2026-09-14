import { QRCodeSVG } from "qrcode.react";

interface QrProps {
  value: string;
  size?: number;
  className?: string;
}

/** Real, scannable QR code (renders an SVG via the `qrcode.react` encoder). */
export function Qr({ value, size = 176, className }: QrProps) {
  const payload = value && value.length > 0 ? value : "KISANQ";
  return (
    <QRCodeSVG
      value={payload}
      size={size}
      level="M"
      includeMargin
      className={className}
      role="img"
      aria-label={`Scannable QR token ${payload}`}
    />
  );
}
