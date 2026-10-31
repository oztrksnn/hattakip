// Hattaki makineler
export const MAKINELER = ['ENJ-01', 'ENJ-02', 'ENJ-03', 'ENJ-04']

export const VARDIYALAR = [
  { kod: 'A', saat: '08:00 - 16:00' },
  { kod: 'B', saat: '16:00 - 24:00' },
  { kod: 'C', saat: '00:00 - 08:00' },
]

// Ürünler: cevrimSn = ideal çevrim süresi (sn), goz = kalıp göz sayısı
// Performans hesabında kullanılıyor
export const URUNLER = [
  { ad: 'Kapak 28 mm', cevrimSn: 8, goz: 16 },
  { ad: 'Şişe Preformu 500 ml', cevrimSn: 14, goz: 8 },
  { ad: 'Kova 5 L', cevrimSn: 32, goz: 1 },
  { ad: 'Kasa Kulpu', cevrimSn: 20, goz: 4 },
]

// Duruş nedenleri ve rozet renkleri
export const DURUS_NEDENLERI = [
  { ad: 'Kalıp Değişimi', renk: 'bg-sky-100 text-sky-800', bar: '#0ea5e9' },
  { ad: 'Makine Arızası', renk: 'bg-red-100 text-red-800', bar: '#ef4444' },
  { ad: 'Malzeme Bekleme', renk: 'bg-amber-100 text-amber-800', bar: '#f59e0b' },
  { ad: 'Parametre Ayarı', renk: 'bg-violet-100 text-violet-800', bar: '#8b5cf6' },
  { ad: 'Kalite Kontrol', renk: 'bg-emerald-100 text-emerald-800', bar: '#10b981' },
  { ad: 'Planlı Bakım', renk: 'bg-slate-200 text-slate-800', bar: '#64748b' },
  { ad: 'Duruş Yok', renk: 'bg-gray-100 text-gray-500', bar: '#d1d5db' },
]

export const VARDIYA_SURESI_DK = 480

export function nedenRengi(neden) {
  const bulunan = DURUS_NEDENLERI.find((n) => n.ad === neden)
  return bulunan ? bulunan.renk : 'bg-gray-100 text-gray-600'
}
