import { useState } from 'react'
import StatCard from './StatCard'
import OeeBreakdown from './OeeBreakdown'
import DailyBarChart from './charts/DailyBarChart'
import { ozetHesapla, gunlukUretim, yuzde, sayi } from '../utils/calculations'
import { nedenRengi } from '../data/constants'
import { yerelTarih, tarihGoster } from '../utils/date'

const DONEMLER = [
  { id: 'bugun', ad: 'Bugün' },
  { id: '7gun', ad: 'Son 7 Gün' },
  { id: 'tumu', ad: 'Tümü' },
]

function Dashboard({ kayitlar }) {
  const [donem, setDonem] = useState('7gun')

  const filtreli = kayitlar.filter((k) => {
    if (donem === 'bugun') return k.tarih === yerelTarih(0)
    if (donem === '7gun') return k.tarih >= yerelTarih(6)
    return true
  })

  const ozet = ozetHesapla(filtreli)
  const gunluk = gunlukUretim(kayitlar, 7)
  const sonKayitlar = [...kayitlar]
    .sort((a, b) => (a.tarih < b.tarih ? 1 : a.tarih > b.tarih ? -1 : b.vardiya.localeCompare(a.vardiya)))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gösterge Paneli</h2>
          <p className="text-sm text-slate-500">
            {filtreli.length} vardiya kaydına göre hesaplandı
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          {DONEMLER.map((d) => (
            <button
              key={d.id}
              onClick={() => setDonem(d.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                donem === d.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d.ad}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard baslik="OEE" deger={yuzde(ozet.oee)} alt="Genel ekipman etkinliği" vurgu="teal" />
        <StatCard baslik="Toplam Üretim" deger={sayi(ozet.uretilen)} alt="adet" vurgu="slate" />
        <StatCard
          baslik="Fire Oranı"
          deger={yuzde(ozet.fireOrani, 2)}
          alt={`${sayi(ozet.fire)} adet fire`}
          vurgu="amber"
        />
        <StatCard
          baslik="Toplam Duruş"
          deger={`${sayi(ozet.durusDk)} dk`}
          alt={`≈ ${(ozet.durusDk / 60).toFixed(1).replace('.', ',')} saat`}
          vurgu="red"
        />
      </div>

      {filtreli.length === 0 && (
        <div className="kart p-6 text-center text-sm text-slate-500">
          Bu dönem için kayıt bulunamadı. "Kayıt Ekle" sekmesinden yeni vardiya kaydı girebilirsiniz.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="kart p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Son 7 Günlük Üretim</h3>
              <p className="text-xs text-slate-500">Günlük toplam adet</p>
            </div>
            <div className="flex gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-teal-700" /> Sağlam
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-amber-500" /> Fire
              </span>
            </div>
          </div>
          <DailyBarChart veri={gunluk} />
        </div>

        <OeeBreakdown ozet={ozet} />
      </div>

      <div className="kart overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Son Kayıtlar</h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {sonKayitlar.map((k) => (
            <li key={k.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs text-white">{k.makine}</span>
                <span className="text-slate-700">{k.urun}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <span>
                  {tarihGoster(k.tarih)} · {k.vardiya} vardiyası
                </span>
                <span className="font-semibold text-slate-800">{sayi(k.uretilen)} adet</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${nedenRengi(k.durusNedeni)}`}>
                  {k.durusNedeni}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
