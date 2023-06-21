import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "^/apiCetak": {
        target: "https://otomax.unitedtronik.co.id:443",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apiCetak/, "/api"),
      },
      "^/api": {
        target: "https://otomax.unitedtronik.co.id:442",
        changeOrigin: true,
      },
      "/host": {
        target: "https://otomax.unitedtronik.co.id:442",
        changeOrigin: true,
      },
    },
  },
  plugins: [vue()],
});
