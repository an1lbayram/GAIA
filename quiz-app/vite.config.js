import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Sınav Hazırlık Platformu',
        short_name: 'SınavQuiz',
        description: 'Üniversite dersleri için interaktif sınav hazırlık ve soru çözüm uygulaması',
        theme_color: '#4f46e5',
        background_color: '#0f172a',
        display: 'standalone'
      }
    })
  ],
})
