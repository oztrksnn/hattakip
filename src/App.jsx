import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import RecordForm from './components/RecordForm'
import RecordList from './components/RecordList'
import DowntimeAnalysis from './components/DowntimeAnalysis'
import Toast from './components/Toast'
import { kayitlariYukle, kayitlariKaydet, ornekVeriyeDon } from './utils/storage'

function App() {
  const [sayfa, setSayfa] = useState('panel')
  const [kayitlar, setKayitlar] = useState(() => kayitlariYukle())
  const [duzenlenen, setDuzenlenen] = useState(null)
  const [mesaj, setMesaj] = useState('')

  // Kayıtlar her değiştiğinde LocalStorage'a yaz
  useEffect(() => {
    kayitlariKaydet(kayitlar)
  }, [kayitlar])

  function bildir(metin) {
    setMesaj(metin)
    setTimeout(() => setMesaj(''), 2500)
  }

  function kayitKaydet(kayit) {
    if (duzenlenen) {
      setKayitlar((onceki) => onceki.map((k) => (k.id === kayit.id ? kayit : k)))
      bildir('Kayıt güncellendi')
      setDuzenlenen(null)
      setSayfa('kayitlar')
    } else {
      setKayitlar((onceki) => [kayit, ...onceki])
      bildir('Kayıt eklendi')
    }
  }

  function kayitSil(id) {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    setKayitlar((onceki) => onceki.filter((k) => k.id !== id))
    bildir('Kayıt silindi')
  }

  function duzenle(kayit) {
    setDuzenlenen(kayit)
    setSayfa('ekle')
  }

  function sifirla() {
    if (!window.confirm('Tüm kayıtlar silinip örnek veriler yüklenecek. Devam edilsin mi?')) return
    setKayitlar(ornekVeriyeDon())
    bildir('Örnek veriler yüklendi')
  }

  function sayfaDegistir(yeni) {
    if (yeni !== 'ekle') setDuzenlenen(null)
    setSayfa(yeni)
  }

  return (
    <div className="min-h-screen">
      <Navbar aktif={sayfa} onDegistir={sayfaDegistir} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {sayfa === 'panel' && <Dashboard kayitlar={kayitlar} />}
        {sayfa === 'ekle' && (
          <RecordForm
            key={duzenlenen ? duzenlenen.id : 'yeni'}
            duzenlenen={duzenlenen}
            onKaydet={kayitKaydet}
            onIptal={() => sayfaDegistir('kayitlar')}
          />
        )}
        {sayfa === 'kayitlar' && (
          <RecordList kayitlar={kayitlar} onSil={kayitSil} onDuzenle={duzenle} onSifirla={sifirla} />
        )}
        {sayfa === 'analiz' && <DowntimeAnalysis kayitlar={kayitlar} />}
      </main>

      <footer className="pb-6 text-center text-xs text-slate-400">
        HatTakip · React + Vite + Tailwind CSS · Veriler tarayıcınızda (LocalStorage) saklanır
      </footer>

      <Toast mesaj={mesaj} />
    </div>
  )
}

export default App
