// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"
// import tsconfigPaths from "vite-tsconfig-paths"

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   base: '/editor/',
//   optimizeDeps: {
//     include: ['@iconify/react', '@tsparticles/react', 'tsparticles'],
//   },
// })



import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/editor/",
  optimizeDeps: {
    include: ["@iconify/react", "@tsparticles/react", "tsparticles"],
  },
  server: {
    proxy: {
      // Proxy to Pexels
      "/pexels": {
        target: "https://api.pexels.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pexels/, ""),
      },
    },
  },
})
