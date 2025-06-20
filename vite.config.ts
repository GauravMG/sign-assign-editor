import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/editor/',
  optimizeDeps: {
    include: ['@iconify/react', '@tsparticles/react', 'tsparticles'],
  },
})
