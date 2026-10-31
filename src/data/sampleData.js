import { MAKINELER, URUNLER, DURUS_NEDENLERI, VARDIYA_SURESI_DK } from './constants'
import { yerelTarih } from '../utils/date'

// Uygulama ilk açıldığında boş görünmesin diye son 7 güne ait örnek kayıtlar üretir.
// Her açılışta aynı verinin gelmesi için basit bir sabit tohumlu rastgele sayı kullanıldı.
function tohumluRastgele(tohum) {
  let s = tohum
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const tarihStr = yerelTarih

export function ornekKayitlarOlustur() {
  const rnd = tohumluRastgele(42)
  const kayitlar = []
  const nedenler = DURUS_NEDENLERI.filter((n) => n.ad !== 'Duruş Yok').map((n) => n.ad)
  // Gerçeğe yakın dağılım için ağırlıklar (kalıp değişimi ve arıza daha sık)
  const agirlikli = [
    nedenler[0], nedenler[0], nedenler[0],
    nedenler[1], nedenler[1],
    nedenler[2], nedenler[2],
    nedenler[3], nedenler[4], nedenler[5],
  ]

  for (let gun = 6; gun >= 0; gun--) {
    for (const vardiya of ['A', 'B']) {
      for (const makine of MAKINELER) {
        const urun = URUNLER[MAKINELER.indexOf(makine)]
        const durusVar = rnd() > 0.15
        const durusDk = durusVar ? Math.round(15 + rnd() * 75) : 0
        const durusNedeni = durusVar ? agirlikli[Math.floor(rnd() * agirlikli.length)] : 'Duruş Yok'
        const calismaSn = (VARDIYA_SURESI_DK - durusDk) * 60
        const teorik = (calismaSn / urun.cevrimSn) * urun.goz
        const uretilen = Math.round(teorik * (0.82 + rnd() * 0.13))
        const fire = Math.round(uretilen * (0.005 + rnd() * 0.03))

        kayitlar.push({
          id: `ornek-${gun}-${vardiya}-${makine}`,
          tarih: tarihStr(gun),
          vardiya,
          makine,
          urun: urun.ad,
          planlananDk: VARDIYA_SURESI_DK,
          uretilen,
          fire,
          durusDk,
          durusNedeni,
          not: '',
        })
      }
    }
  }
  return kayitlar
}
