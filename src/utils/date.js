// toISOString() UTC'ye çevirdiği için gece saatlerinde bir önceki günü verebiliyor.
// Bu yüzden tarihi yerel saate göre YYYY-AA-GG formatında üretiyoruz.
export function yerelTarih(gunOnce = 0) {
  const d = new Date()
  d.setDate(d.getDate() - gunOnce)
  const ay = String(d.getMonth() + 1).padStart(2, '0')
  const gun = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${ay}-${gun}`
}

export function tarihGoster(tarih) {
  const [y, a, g] = tarih.split('-')
  return `${g}.${a}.${y}`
}
