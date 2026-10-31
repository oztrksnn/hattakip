import { ornekKayitlarOlustur } from '../data/sampleData'

const ANAHTAR = 'hattakip-kayitlar'

export function kayitlariYukle() {
  try {
    const veri = localStorage.getItem(ANAHTAR)
    if (veri) return JSON.parse(veri)
  } catch (hata) {
    console.error('LocalStorage okunamadı:', hata)
  }
  // İlk açılış: örnek verilerle başla
  return ornekKayitlarOlustur()
}

export function kayitlariKaydet(kayitlar) {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify(kayitlar))
  } catch (hata) {
    console.error('LocalStorage yazılamadı:', hata)
  }
}

export function ornekVeriyeDon() {
  const kayitlar = ornekKayitlarOlustur()
  kayitlariKaydet(kayitlar)
  return kayitlar
}
