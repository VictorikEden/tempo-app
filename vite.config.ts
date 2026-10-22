import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
const path=process.env.PAGES_BASE_PATH||'/';
export default defineConfig({
  plugins:[react()],
  base:path.endsWith('/')?path:path+'/',
  define:{'process.env.NODE_ENV':JSON.stringify(process.env.NODE_ENV||'production')},
  build:{outDir:'dist',emptyOutDir:true}
});
