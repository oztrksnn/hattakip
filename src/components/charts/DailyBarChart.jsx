import { sayi } from '../../utils/calculations'

// Günlük üretim grafiği (SVG ile, harici kütüphane kullanmadan)
// Sağlam ürün (koyu) + fire (turuncu) üst üste gösterilir
function DailyBarChart({ veri }) {
  const W = 640
  const H = 260
  const sol = 56
  const alt = 32
  const ust = 16
  const cizimH = H - alt - ust
  const cizimW = W - sol - 12
  const enBuyuk = Math.max(...veri.map((d) => d.uretilen), 1)
  // Eksen için yuvarlak bir üst sınır
  const adim = Math.pow(10, Math.floor(Math.log10(enBuyuk)))
  const ustSinir = Math.ceil(enBuyuk / adim) * adim
  const cizgiler = 4
  const barGenislik = (cizimW / veri.length) * 0.55

  const y = (deger) => ust + cizimH - (deger / ustSinir) * cizimH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Son 7 günün üretim grafiği">
      {Array.from({ length: cizgiler + 1 }, (_, i) => {
        const deger = (ustSinir / cizgiler) * i
        return (
          <g key={i}>
            <line x1={sol} x2={W - 12} y1={y(deger)} y2={y(deger)} stroke="#e2e8f0" />
            <text x={sol - 8} y={y(deger) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
              {deger >= 1000 ? `${Math.round(deger / 1000)}B` : deger}
            </text>
          </g>
        )
      })}

      {veri.map((d, i) => {
        const x = sol + (cizimW / veri.length) * i + (cizimW / veri.length - barGenislik) / 2
        const saglam = d.uretilen - d.fire
        return (
          <g key={d.etiket}>
            <title>{`${d.etiket}: ${sayi(d.uretilen)} adet (fire ${sayi(d.fire)})`}</title>
            <rect x={x} y={y(saglam)} width={barGenislik} height={Math.max(cizimH + ust - y(saglam), 0)} rx="3" fill="#0f766e" />
            <rect x={x} y={y(d.uretilen)} width={barGenislik} height={Math.max(y(saglam) - y(d.uretilen), 0)} fill="#f59e0b" />
            <text x={x + barGenislik / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#64748b">
              {d.etiket}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default DailyBarChart
