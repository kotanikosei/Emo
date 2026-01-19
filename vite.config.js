import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    preview: {
      allowedHosts: ['emo-cale-8752136422.europe-west1.run.app']
    }
  }
})

