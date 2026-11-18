import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // JSX + fast refresh
    tailwindcss(), // Tailwind v4: scans your files and generates only the classes you use
  ],
});