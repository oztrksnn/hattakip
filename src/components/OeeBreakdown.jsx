import { yuzde } from '../utils/calculations'

// OEE'yi oluşturan üç bileşeni çubuk olarak gösterir
function OeeBreakdown({ ozet }) {
  const satirlar = [
    { ad: 'Kullanılabilirlik', deger: ozet.kullanilabilirlik, aciklama: 'Duruşlar hariç çalışma oranı' },
    { ad: 'Performans', deger: ozet.performans, aciklama: 'İdeal çevrim süresine göre hız' },
    { ad: 'Kalite', deger: ozet.kalite, aciklama: 'Sağlam ürün oranı' },
  ]

  const durum =
    ozet.oee >= 0.85 ? { metin: 'Dünya standardı', renk: 'text-emerald-600' }
      : ozet.oee >= 0.6 ? { metin: 'Tipik seviye, iyileştirme alanı var', renk: 'text-amber-600' }
        : { metin: 'Düşük, acil iyileştirme gerekli', renk: 'text-red-600' }

  return (
    <div className="kart p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">OEE Bileşenleri</h3>
          <p className="text-xs text-slate-500">OEE = Kullanılabilirlik × Performans × Kalite</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-teal-700">{yuzde(ozet.oee)}</p>
          <p className={`text-xs font-medium ${durum.renk}`}>{durum.metin}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {satirlar.map((s) => (
          <div key={s.ad}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-slate-700">{s.ad}</span>
              <span className="font-semibold text-slate-900">{yuzde(s.deger)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div className="h-2.5 rounded-full bg-teal-600" style={{ width: `${Math.min(s.deger * 100, 100)}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-400">{s.aciklama}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OeeBreakdown
