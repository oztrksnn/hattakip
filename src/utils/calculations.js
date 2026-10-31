import { URUNLER } from '../data/constants'
import { yerelTarih } from './date'

// OEE = Kullanılabilirlik x Performans x Kalite
// Kullanılabilirlik = (planlanan süre - duruş) / planlanan süre
// Performans        = (üretilen x ideal çevrim / göz sayısı) / çalışma süresi
// Kalite            = (üretilen - fire) / üretilen

export function kayitOee(kayit) {
  const urun = URUNLER.find((u) => u.ad === kayit.urun)
  const planlanan = Number(kayit.planlananDk) || 0
  const durus = Number(kayit.durusDk) || 0
  const uretilen = Number(kayit.uretilen) || 0
  const fire = Number(kayit.fire) || 0
  const calismaDk = Math.max(planlanan - durus, 0)

  const kullanilabilirlik = planlanan > 0 ? calismaDk / planlanan : 0
  const idealSn = urun ? (uretilen * urun.cevrimSn) / urun.goz : 0
  const performans = calismaDk > 0 ? Math.min(idealSn / (calismaDk * 60), 1) : 0
  const kalite = uretilen > 0 ? (uretilen - fire) / uretilen : 0

  return {
    kullanilabilirlik,
    performans,
    kalite,
    oee: kullanilabilirlik * performans * kalite,
  }
}

// Birden fazla kaydın özetini çıkarır (gösterge paneli kartları için)
export function ozetHesapla(kayitlar) {
  if (kayitlar.length === 0) {
    return { uretilen: 0, fire: 0, fireOrani: 0, durusDk: 0, oee: 0, kullanilabilirlik: 0, performans: 0, kalite: 0 }
  }
  const uretilen = kayitlar.reduce((t, k) => t + Number(k.uretilen), 0)
  const fire = kayitlar.reduce((t, k) => t + Number(k.fire), 0)
  const durusDk = kayitlar.reduce((t, k) => t + Number(k.durusDk), 0)

  // OEE bileşenlerinin planlanan süreye göre ağırlıklı ortalaması
  let toplamSure = 0
  let k = 0, p = 0, q = 0
  for (const kayit of kayitlar) {
    const s = Number(kayit.planlananDk) || 0
    const o = kayitOee(kayit)
    toplamSure += s
    k += o.kullanilabilirlik * s
    p += o.performans * s
    q += o.kalite * s
  }
  const kullanilabilirlik = toplamSure ? k / toplamSure : 0
  const performans = toplamSure ? p / toplamSure : 0
  const kalite = toplamSure ? q / toplamSure : 0

  return {
    uretilen,
    fire,
    fireOrani: uretilen ? fire / uretilen : 0,
    durusDk,
    kullanilabilirlik,
    performans,
    kalite,
    oee: kullanilabilirlik * performans * kalite,
  }
}

// Son n günün günlük üretim ve fire toplamları
export function gunlukUretim(kayitlar, gunSayisi = 7) {
  const sonuc = []
  for (let i = gunSayisi - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const tarih = yerelTarih(i)
    const gunKayitlari = kayitlar.filter((k) => k.tarih === tarih)
    sonuc.push({
      etiket: d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      uretilen: gunKayitlari.reduce((t, k) => t + Number(k.uretilen), 0),
      fire: gunKayitlari.reduce((t, k) => t + Number(k.fire), 0),
    })
  }
  return sonuc
}

// Duruş nedenlerine göre Pareto verisi (büyükten küçüğe + kümülatif yüzde)
export function paretoVerisi(kayitlar) {
  const toplamlar = {}
  for (const k of kayitlar) {
    if (!k.durusDk || k.durusNedeni === 'Duruş Yok') continue
    toplamlar[k.durusNedeni] = (toplamlar[k.durusNedeni] || 0) + Number(k.durusDk)
  }
  const liste = Object.entries(toplamlar)
    .map(([neden, dk]) => ({ neden, dk }))
    .sort((a, b) => b.dk - a.dk)
  const genelToplam = liste.reduce((t, x) => t + x.dk, 0)
  let kumulatif = 0
  return liste.map((x) => {
    kumulatif += x.dk
    return { ...x, yuzde: x.dk / genelToplam, kumulatif: kumulatif / genelToplam }
  })
}

export function makineBazli(kayitlar, makineler) {
  return makineler.map((m) => {
    const mk = kayitlar.filter((k) => k.makine === m)
    const ozet = ozetHesapla(mk)
    return { makine: m, oee: ozet.oee, durusDk: ozet.durusDk, uretilen: ozet.uretilen, kayitSayisi: mk.length }
  })
}

export const yuzde = (x, basamak = 1) => `%${(x * 100).toFixed(basamak).replace('.', ',')}`
export const sayi = (x) => Number(x).toLocaleString('tr-TR')
