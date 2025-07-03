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

// vite.config.mts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/editor/",
  optimizeDeps: {
    include: ["@iconify/react", "@tsparticles/react", "tsparticles"],
  },
  server: {
    proxy: {
      "/pexels": {
        target: "https://api.pexels.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pexels/, ""),
      },
    },
  },
  build: {
    lib: {
      entry: "src/index.tsx", // this exists in your project
      name: "SignAssignEditor",
      fileName: (format) => `react-design-editor.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});



// import { defineConfig } from "vite"
// import react from "@vitejs/plugin-react"
// import tsconfigPaths from "vite-tsconfig-paths"

// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   base: "/editor/",
//   optimizeDeps: {
//     include: ["@iconify/react", "@tsparticles/react", "tsparticles"],
//   },
//   server: {
//     proxy: {
//       // Proxy to Pexels
//       "/pexels": {
//         target: "https://api.pexels.com/v1",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/pexels/, ""),
//       },
//     },
//   },
// })
