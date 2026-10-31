import { DURUS_NEDENLERI } from '../../data/constants'

// Pareto grafiği: çubuklar duruş süresini (dk), çizgi kümülatif yüzdeyi gösterir.
// %80 çizgisi, en önemli nedenleri ayırt etmeyi kolaylaştırır.
function ParetoChart({ veri }) {
  const W = 680
  const H = 300
  const sol = 48
  const sag = 44
  const ust = 20
  const alt = 56
  const cizimW = W - sol - sag
  const cizimH = H - ust - alt

  if (veri.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">Gösterilecek duruş kaydı yok.</p>
  }

  const enBuyuk = Math.max(...veri.map((d) => d.dk))
  const ustSinir = Math.ceil(enBuyuk / 100) * 100
  const aralik = cizimW / veri.length
  const barW = aralik * 0.6

  const yDk = (dk) => ust + cizimH - (dk / ustSinir) * cizimH
  const yYuzde = (p) => ust + cizimH - p * cizimH
  const merkezX = (i) => sol + aralik * i + aralik / 2

  const cizgiNoktalari = veri.map((d, i) => `${merkezX(i)},${yYuzde(d.kumulatif)}`).join(' ')

  const renk = (neden) => DURUS_NEDENLERI.find((n) => n.ad === neden)?.bar || '#94a3b8'

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Duruş nedenleri Pareto grafiği">
      {/* Yatay ızgara ve sol eksen (dk) */}
      {[0, 0.25, 0.5, 0.75, 1].map((oran) => (
        <g key={oran}>
          <line x1={sol} x2={W - sag} y1={yYuzde(oran)} y2={yYuzde(oran)} stroke="#e2e8f0" />
          <text x={sol - 8} y={yYuzde(oran) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
            {Math.round(ustSinir * oran)}
          </text>
          <text x={W - sag + 8} y={yYuzde(oran) + 4} fontSize="11" fill="#94a3b8">
            %{oran * 100}
          </text>
        </g>
      ))}

      {/* %80 referans çizgisi */}
      <line x1={sol} x2={W - sag} y1={yYuzde(0.8)} y2={yYuzde(0.8)} stroke="#ef4444" strokeDasharray="5 4" />
      <text x={W - sag - 4} y={yYuzde(0.8) - 6} textAnchor="end" fontSize="11" fill="#ef4444">
        %80
      </text>

      {veri.map((d, i) => (
        <g key={d.neden}>
          <title>{`${d.neden}: ${d.dk} dk (%${(d.yuzde * 100).toFixed(1)})`}</title>
          <rect
            x={merkezX(i) - barW / 2}
            y={yDk(d.dk)}
            width={barW}
            height={ust + cizimH - yDk(d.dk)}
            rx="3"
            fill={renk(d.neden)}
          />
          <text x={merkezX(i)} y={ust + cizimH - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
            {d.dk}
          </text>
          {d.neden.split(' ').map((kelime, j) => (
            <text key={j} x={merkezX(i)} y={H - alt + 18 + j * 13} textAnchor="middle" fontSize="11" fill="#475569">
              {kelime}
            </text>
          ))}
        </g>
      ))}

      {/* Kümülatif çizgi */}
      <polyline points={cizgiNoktalari} fill="none" stroke="#0f172a" strokeWidth="2" />
      {veri.map((d, i) => (
        <circle key={d.neden} cx={merkezX(i)} cy={yYuzde(d.kumulatif)} r="4" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default ParetoChart
