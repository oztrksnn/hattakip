function StatCard({ baslik, deger, alt, vurgu = 'teal' }) {
  const renkler = {
    teal: 'border-l-teal-600',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
    slate: 'border-l-slate-700',
  }
  return (
    <div className={`kart border-l-4 p-4 ${renkler[vurgu]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{baslik}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{deger}</p>
      {alt && <p className="mt-1 text-xs text-slate-500">{alt}</p>}
    </div>
  )
}

export default StatCard
