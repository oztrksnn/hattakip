import { useState } from 'react'
import ParetoChart from './charts/ParetoChart'
import { MAKINELER } from '../data/constants'
import { paretoVerisi, makineBazli, yuzde, sayi } from '../utils/calculations'

function DowntimeAnalysis({ kayitlar }) {
  const [makine, setMakine] = useState('')

  const secili = makine ? kayitlar.filter((k) => k.makine === makine) : kayitlar
  const pareto = paretoVerisi(secili)
  const makineler = makineBazli(kayitlar, MAKINELER)
  const toplamDurus = pareto.reduce((t, x) => t + x.dk, 0)

  // Kümülatif %80'e ulaşana kadar olan nedenler = öncelikli iyileştirme alanları
  const oncelikli = []
  for (const p of pareto) {
    oncelikli.push(p)
    if (p.kumulatif >= 0.8) break
  }

  const enKotuMakine = [...makineler].filter((m) => m.kayitSayisi > 0).sort((a, b) => a.oee - b.oee)[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Duruş Analizi</h2>
          <p className="text-sm text-slate-500">Pareto (80/20) yöntemi ile en çok kayıp yaratan nedenler</p>
        </div>
        <select value={makine} onChange={(e) => setMakine(e.target.value)} className="girdi sm:w-56">
          <option value="">Tüm makineler</option>
          {MAKINELER.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="kart p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Duruş Nedenleri Pareto Grafiği</h3>
          <p className="mb-3 text-xs text-slate-500">
            Sol eksen: duruş süresi (dk) · Sağ eksen: kümülatif yüzde · Toplam {sayi(toplamDurus)} dk
          </p>
          <ParetoChart veri={pareto} />
        </div>

        <div className="kart p-5">
          <h3 className="font-semibold text-slate-900">Öncelikli İyileştirme Alanları</h3>
          <p className="mb-4 text-xs text-slate-500">Toplam duruşun ~%80'ini oluşturan nedenler</p>
          {oncelikli.length === 0 ? (
            <p className="text-sm text-slate-400">Duruş kaydı yok.</p>
          ) : (
            <ol className="space-y-3">
              {oncelikli.map((p, i) => (
                <li key={p.neden} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{p.neden}</p>
                    <p className="text-xs text-slate-500">
                      {p.dk} dk · pay {yuzde(p.yuzde)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {enKotuMakine && !makine && (
            <div className="mt-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <strong>Not:</strong> En düşük OEE {enKotuMakine.makine} makinesinde ({yuzde(enKotuMakine.oee)}). İlk
              inceleme bu makineden başlatılabilir.
            </div>
          )}
        </div>
      </div>

      <div className="kart overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Makine Bazlı Karşılaştırma</h3>
        </div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {makineler.map((m) => (
            <div key={m.makine} className="p-5">
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs text-white">{m.makine}</span>
                <span className="text-xs text-slate-400">{m.kayitSayisi} kayıt</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{yuzde(m.oee)}</p>
              <p className="text-xs text-slate-500">OEE</p>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-teal-600" style={{ width: `${m.oee * 100}%` }} />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-600">
                <span>Duruş: {sayi(m.durusDk)} dk</span>
                <span>{sayi(m.uretilen)} adet</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DowntimeAnalysis
