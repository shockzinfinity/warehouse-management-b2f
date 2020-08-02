export default (text, limit) => {
  if (!text.length) return ''
  let summary = '내용없음'
  const ts = text.split('\n')
  const ss = []

  // TODO: regex 처리 필요

  for (const t of ts) {
    const index = t.indexOf('data:image')
    if (index >= 0) continue
    // const fc = t.substr(0, 1)
    // if (fc === '[' || fc === '!') continue
    if (t.length) ss.push(t)
  }

  const s = ss.join('\n')
  if (s.length > limit) {
    summary = s.substr(0, limit)
    summary += '\n...'
  } else {
    summary = s
  }

  return summary
}
