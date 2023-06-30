import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// });

export default defineConfig(({command}) => {
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    base: '/',
  }

  if(command !== 'serve') {
    config.base = '/sensor_ketinggian_air_frontend/'
  }

  return config
})
