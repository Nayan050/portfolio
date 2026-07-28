import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* The three hub pages are plain static HTML in public/, not part of the SPA.
   Vite's dev server answers a directory path like /news/ with the SPA's
   index.html, so the links appear to work but load the portfolio again.
   Static hosts resolve the directory index correctly, so this only aligns
   dev with production. */
const HUB_PATHS = /^\/(news|tools|knowledge)\/?$/

function serveHubIndexes() {
  return {
    name: 'serve-hub-indexes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = req.url.split('?')
        const match = HUB_PATHS.exec(pathname)
        if (match) {
          req.url = `/${match[1]}/index.html${query ? `?${query}` : ''}`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveHubIndexes()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
