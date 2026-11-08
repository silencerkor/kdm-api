export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  const { nama, type } = req.query
  if (!nama) return res.status(400).json({ error: 'nama required' })

  const nama_upper = nama.toUpperCase()
  const prefix = type === 'pengurus' ? 'pengurus' : 'anggota'
  
  // Test fetch satu file dulu
  const testUrl = `https://raw.githubusercontent.com/silencerkor/kdm-api/refs/heads/main/${prefix}_aa`
  
  try {
    const r = await fetch(testUrl)
    const status = r.status
    const text = await r.text()
    const preview = text.substring(0, 500)
    
    return res.json({
      debug: true,
      url: testUrl,
      status,
      preview
    })
  } catch(e) {
    return res.json({ error: e.message })
  }
}