const SEKMELER = [
  { id: 'panel', ad: 'Gösterge Paneli' },
  { id: 'ekle', ad: 'Kayıt Ekle' },
  { id: 'kayitlar', ad: 'Kayıtlar' },
  { id: 'analiz', ad: 'Duruş Analizi' },
]

function Navbar({ aktif, onDegistir }) {
  return (
    <header className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-lg font-bold">
            H<span className="text-amber-300">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">HatTakip</h1>
            <p className="text-xs text-slate-400">Enjeksiyon hattı üretim ve duruş takibi</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto">
          {SEKMELER.map((s) => (
            <button
              key={s.id}
              onClick={() => onDegistir(s.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                aktif === s.id ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {s.ad}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
