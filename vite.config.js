import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
//import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME

  return defineConfig({
    /* define: {
      'process.env': process.env,
    }, */
    resolve: {
      alias: {
        //src 路径别名
        '@': path.resolve(__dirname, 'src'),
        process: 'process/browser',
        stream: 'stream-browserify',
        zlib: 'browserify-zlib',
        util: 'util',
      },
    },
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 4000,
    },
  });
};
