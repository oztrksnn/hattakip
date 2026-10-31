import { useState } from 'react'
import { MAKINELER, VARDIYALAR, URUNLER, DURUS_NEDENLERI, VARDIYA_SURESI_DK } from '../data/constants'
import { kayitOee, yuzde } from '../utils/calculations'
import { yerelTarih } from '../utils/date'

const BOS_FORM = {
  tarih: yerelTarih(0),
  vardiya: 'A',
  makine: MAKINELER[0],
  urun: URUNLER[0].ad,
  planlananDk: VARDIYA_SURESI_DK,
  uretilen: '',
  fire: '',
  durusDk: 0,
  durusNedeni: 'Duruş Yok',
  not: '',
}

function RecordForm({ duzenlenen, onKaydet, onIptal }) {
  const [form, setForm] = useState(duzenlenen || BOS_FORM)
  const [hatalar, setHatalar] = useState({})

  function degistir(e) {
    const { name, value } = e.target
    setForm((onceki) => {
      const yeni = { ...onceki, [name]: value }
      // Duruş süresi 0 ise neden otomatik "Duruş Yok" olsun
      if (name === 'durusDk' && Number(value) === 0) yeni.durusNedeni = 'Duruş Yok'
      if (name === 'durusDk' && Number(value) > 0 && onceki.durusNedeni === 'Duruş Yok') {
        yeni.durusNedeni = DURUS_NEDENLERI[0].ad
      }
      return yeni
    })
  }

  function dogrula() {
    const h = {}
    const planlanan = Number(form.planlananDk)
    const uretilen = Number(form.uretilen)
    const fire = Number(form.fire)
    const durus = Number(form.durusDk)

    if (!form.tarih) h.tarih = 'Tarih seçiniz'
    if (!planlanan || planlanan <= 0) h.planlananDk = "Planlanan süre 0'dan büyük olmalı"
    if (form.uretilen === '' || uretilen < 0) h.uretilen = 'Üretilen adet giriniz'
    if (form.fire === '' || fire < 0) h.fire = 'Fire adedi giriniz (yoksa 0)'
    if (fire > uretilen) h.fire = 'Fire, üretilen adetten büyük olamaz'
    if (durus < 0) h.durusDk = 'Negatif olamaz'
    if (durus > planlanan) h.durusDk = 'Duruş, planlanan süreyi aşamaz'
    if (durus > 0 && form.durusNedeni === 'Duruş Yok') h.durusNedeni = 'Duruş nedeni seçiniz'
    return h
  }

  function gonder(e) {
    e.preventDefault()
    const h = dogrula()
    setHatalar(h)
    if (Object.keys(h).length > 0) return

    onKaydet({
      ...form,
      id: duzenlenen ? duzenlenen.id : crypto.randomUUID(),
      planlananDk: Number(form.planlananDk),
      uretilen: Number(form.uretilen),
      fire: Number(form.fire),
      durusDk: Number(form.durusDk),
    })
    if (!duzenlenen) setForm({ ...BOS_FORM, tarih: form.tarih, vardiya: form.vardiya })
  }

  // Form doldurulurken anlık OEE önizlemesi
  const onizleme = form.uretilen !== '' ? kayitOee(form) : null
  const secilenUrun = URUNLER.find((u) => u.ad === form.urun)

  const hata = (alan) => hatalar[alan] && <p className="mt-1 text-xs text-red-600">{hatalar[alan]}</p>

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={gonder} className="kart p-6 lg:col-span-2" noValidate>
        <h2 className="text-xl font-bold text-slate-900">{duzenlenen ? 'Kaydı Düzenle' : 'Yeni Vardiya Kaydı'}</h2>
        <p className="mb-6 text-sm text-slate-500">Vardiya sonunda makine bazında üretim ve duruş bilgilerini girin.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="etiket" htmlFor="tarih">Tarih</label>
            <input id="tarih" type="date" name="tarih" value={form.tarih} onChange={degistir} className="girdi" />
            {hata('tarih')}
          </div>
          <div>
            <label className="etiket" htmlFor="vardiya">Vardiya</label>
            <select id="vardiya" name="vardiya" value={form.vardiya} onChange={degistir} className="girdi">
              {VARDIYALAR.map((v) => (
                <option key={v.kod} value={v.kod}>
                  {v.kod} vardiyası ({v.saat})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="etiket" htmlFor="makine">Makine</label>
            <select id="makine" name="makine" value={form.makine} onChange={degistir} className="girdi">
              {MAKINELER.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="etiket" htmlFor="urun">Ürün</label>
            <select id="urun" name="urun" value={form.urun} onChange={degistir} className="girdi">
              {URUNLER.map((u) => (
                <option key={u.ad}>{u.ad}</option>
              ))}
            </select>
            {secilenUrun && (
              <p className="mt-1 text-xs text-slate-400">
                İdeal çevrim {secilenUrun.cevrimSn} sn · {secilenUrun.goz} gözlü kalıp
              </p>
            )}
          </div>
          <div>
            <label className="etiket" htmlFor="planlananDk">Planlanan Süre (dk)</label>
            <input id="planlananDk" type="number" min="1" name="planlananDk" value={form.planlananDk} onChange={degistir} className="girdi" />
            {hata('planlananDk')}
          </div>
          <div>
            <label className="etiket" htmlFor="uretilen">Üretilen (adet)</label>
            <input id="uretilen" type="number" min="0" name="uretilen" value={form.uretilen} onChange={degistir} className="girdi" placeholder="ör. 25000" />
            {hata('uretilen')}
          </div>
          <div>
            <label className="etiket" htmlFor="fire">Fire (adet)</label>
            <input id="fire" type="number" min="0" name="fire" value={form.fire} onChange={degistir} className="girdi" placeholder="ör. 320" />
            {hata('fire')}
          </div>
          <div>
            <label className="etiket" htmlFor="durusDk">Duruş Süresi (dk)</label>
            <input id="durusDk" type="number" min="0" name="durusDk" value={form.durusDk} onChange={degistir} className="girdi" />
            {hata('durusDk')}
          </div>
          <div className="sm:col-span-2">
            <label className="etiket" htmlFor="durusNedeni">Duruş Nedeni</label>
            <select id="durusNedeni" name="durusNedeni" value={form.durusNedeni} onChange={degistir} className="girdi">
              {DURUS_NEDENLERI.map((n) => (
                <option key={n.ad}>{n.ad}</option>
              ))}
            </select>
            {hata('durusNedeni')}
          </div>
          <div className="sm:col-span-2">
            <label className="etiket" htmlFor="not">Not (isteğe bağlı)</label>
            <textarea id="not" name="not" rows="2" value={form.not} onChange={degistir} className="girdi" placeholder="ör. Kalıp sıcaklığı ayarlandı, 2. gözde çapak" />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="submit" className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            {duzenlenen ? 'Güncelle' : 'Kaydet'}
          </button>
          {duzenlenen && (
            <button type="button" onClick={onIptal} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Vazgeç
            </button>
          )}
        </div>
      </form>

      <aside className="kart h-fit p-6">
        <h3 className="font-semibold text-slate-900">Anlık OEE Önizleme</h3>
        <p className="mb-4 text-xs text-slate-500">Girdiğiniz değerlere göre bu vardiyanın OEE değeri</p>
        {onizleme ? (
          <>
            <p className="text-4xl font-bold text-teal-700">{yuzde(onizleme.oee)}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Kullanılabilirlik</dt>
                <dd className="font-semibold">{yuzde(onizleme.kullanilabilirlik)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Performans</dt>
                <dd className="font-semibold">{yuzde(onizleme.performans)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Kalite</dt>
                <dd className="font-semibold">{yuzde(onizleme.kalite)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-sm text-slate-400">Üretilen adet girildiğinde hesaplanır.</p>
        )}
      </aside>
    </div>
  )
}

export default RecordForm
