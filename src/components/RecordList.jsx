import { useState } from 'react'
import { MAKINELER, VARDIYALAR, DURUS_NEDENLERI, nedenRengi } from '../data/constants'
import { kayitOee, yuzde, sayi } from '../utils/calculations'
import { tarihGoster } from '../utils/date'

function oeeRengi(oee) {
  if (oee >= 0.85) return 'text-emerald-700'
  if (oee >= 0.6) return 'text-amber-600'
  return 'text-red-600'
}

function RecordList({ kayitlar, onSil, onDuzenle, onSifirla }) {
  const [makine, setMakine] = useState('')
  const [vardiya, setVardiya] = useState('')
  const [neden, setNeden] = useState('')
  const [arama, setArama] = useState('')

  const filtreli = kayitlar
    .filter((k) => !makine || k.makine === makine)
    .filter((k) => !vardiya || k.vardiya === vardiya)
    .filter((k) => !neden || k.durusNedeni === neden)
    .filter((k) => {
      const q = arama.trim().toLocaleLowerCase('tr-TR')
      if (!q) return true
      return `${k.urun} ${k.not}`.toLocaleLowerCase('tr-TR').includes(q)
    })
    .sort((a, b) => (a.tarih < b.tarih ? 1 : a.tarih > b.tarih ? -1 : a.vardiya.localeCompare(b.vardiya)))

  function csvIndir() {
    const baslik = ['Tarih', 'Vardiya', 'Makine', 'Ürün', 'Planlanan (dk)', 'Üretilen', 'Fire', 'Duruş (dk)', 'Duruş Nedeni', 'OEE (%)', 'Not']
    const satirlar = filtreli.map((k) => [
      k.tarih, k.vardiya, k.makine, k.urun, k.planlananDk, k.uretilen, k.fire, k.durusDk, k.durusNedeni,
      (kayitOee(k).oee * 100).toFixed(1), (k.not || '').replace(/;/g, ','),
    ])
    const icerik = [baslik, ...satirlar].map((s) => s.join(';')).join('\n')
    // Excel'in Türkçe karakterleri doğru açması için BOM ekleniyor
    const blob = new Blob(['﻿' + icerik], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hattakip-kayitlar.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtreTemizle = () => {
    setMakine('')
    setVardiya('')
    setNeden('')
    setArama('')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kayıtlar</h2>
          <p className="text-sm text-slate-500">
            {filtreli.length} / {kayitlar.length} kayıt gösteriliyor
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={csvIndir} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            CSV İndir
          </button>
          <button onClick={onSifirla} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            Örnek Verilere Dön
          </button>
        </div>
      </div>

      <div className="kart grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Ürün veya not ara..." className="girdi lg:col-span-2" />
        <select value={makine} onChange={(e) => setMakine(e.target.value)} className="girdi">
          <option value="">Tüm makineler</option>
          {MAKINELER.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={vardiya} onChange={(e) => setVardiya(e.target.value)} className="girdi">
          <option value="">Tüm vardiyalar</option>
          {VARDIYALAR.map((v) => <option key={v.kod} value={v.kod}>{v.kod} vardiyası</option>)}
        </select>
        <select value={neden} onChange={(e) => setNeden(e.target.value)} className="girdi">
          <option value="">Tüm duruş nedenleri</option>
          {DURUS_NEDENLERI.map((n) => <option key={n.ad}>{n.ad}</option>)}
        </select>
      </div>

      <div className="kart overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Vrd.</th>
              <th className="px-4 py-3">Makine</th>
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3 text-right">Üretilen</th>
              <th className="px-4 py-3 text-right">Fire</th>
              <th className="px-4 py-3 text-right">Duruş</th>
              <th className="px-4 py-3">Neden</th>
              <th className="px-4 py-3 text-right">OEE</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtreli.map((k) => {
              const oee = kayitOee(k).oee
              return (
                <tr key={k.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3">{tarihGoster(k.tarih)}</td>
                  <td className="px-4 py-3 font-semibold">{k.vardiya}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.makine}</td>
                  <td className="px-4 py-3" title={k.not}>
                    {k.urun}
                    {k.not && <span className="ml-1 text-slate-400">✎</span>}
                  </td>
                  <td className="px-4 py-3 text-right">{sayi(k.uretilen)}</td>
                  <td className="px-4 py-3 text-right">
                    {sayi(k.fire)} <span className="text-xs text-slate-400">({yuzde(k.uretilen ? k.fire / k.uretilen : 0)})</span>
                  </td>
                  <td className="px-4 py-3 text-right">{k.durusDk} dk</td>
                  <td className="px-4 py-3">
                    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${nedenRengi(k.durusNedeni)}`}>
                      {k.durusNedeni}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${oeeRengi(oee)}`}>{yuzde(oee)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button onClick={() => onDuzenle(k)} className="mr-2 text-teal-700 hover:underline">Düzenle</button>
                    <button onClick={() => onSil(k.id)} className="text-red-600 hover:underline">Sil</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtreli.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500">
            Filtreye uyan kayıt yok.{' '}
            <button onClick={filtreTemizle} className="text-teal-700 underline">Filtreleri temizle</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordList
