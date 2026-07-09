const fs = require('fs')
const code = fs.readFileSync('src/app/admin/(dashboard)/DashboardCharts.tsx', 'utf8')
try {
  require('prettier').format(code, { filepath: 'DashboardCharts.tsx' })
} catch (e) {
  console.log(e.message)
}
