export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const { nama, type } = req.query
  if (!nama) return res.status(400).json({ error: 'nama required' })

  const nama_upper = nama.toUpperCase()
  const prefix = type === 'pengurus' ? 'pengurus' : 'anggota'
  const results = []

  const letters = 'abcdefghijklmnopqrstuvwxyz'
  for (const a of letters) {
    for (const b of letters) {
      const suffix = a + b
      const url = `https://raw.githubusercontent.com/silencerkor/kdm-api/main/${prefix}_${suffix}`
      try {
        const r = await fetch(url)
        if (!r.ok) break
        const text = await r.text()
        const lines = text.split('\n')
        for (const line of lines) {
          if (line.toUpperCase().includes(nama_upper)) {
            try { results.push(JSON.parse(line.replace(/,$/, ''))) } catch(e) {}
          }
        }
      } catch(e) { break }
      if (results.length >= 10) break
    }
    if (results.length >= 10) break
  }

  res.json({ status: 'success', total: results.length, data: results })
}