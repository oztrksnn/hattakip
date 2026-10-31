function Toast({ mesaj }) {
  if (!mesaj) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
      ✓ {mesaj}
    </div>
  )
}

export default Toast
