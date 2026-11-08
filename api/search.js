export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  const { nama, type } = req.query
  if (!nama) return res.status(400).json({ error: 'nama required' })

  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN
  const nama_upper = nama.toUpperCase()
  const prefix = type === 'pengurus' ? 'pengurus' : 'anggota'
  const results = []

  const letters = 'abcdefghijklmnopqrstuvwxyz'
  
  outer:
  for (const a of letters) {
    for (const b of letters) {
      const suffix = a + b
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${prefix}_${suffix}`
      
      try {
        const r = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!r.ok) break outer
        
        const data = await r.json()
        
        for (const item of data) {
          if (item.name && item.name.toUpperCase().includes(nama_upper)) {
            results.push(item)
          }
        }
      } catch(e) {
        break outer
      }
      
      if (results.length >= 10) break outer
    }
  }

  res.json({
    status: 'success',
    total: results.length,
    data: results
  })
}