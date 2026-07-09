const fs = require('fs')
try {
  require('@babel/core').transformFileSync('src/app/admin/(dashboard)/DashboardCharts.tsx', {
    presets: ['@babel/preset-react', '@babel/preset-typescript']
  })
} catch(e) {
  console.log(e.message)
}
