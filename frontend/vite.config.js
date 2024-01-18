import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {readFileSync} from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: readFileSync('./mkcert/127.0.0.1-key.pem'),
      cert: readFileSync('./mkcert/127.0.0.1.pem')
    },
    // host: 'localhost',
    port: 4000,
    //Disable this in production.
    proxy: {
      "/api": {
        // target: 'https://127.0.0.1:3000',
         // pathRewrite: {'^/api': ''},
        //${process.env.PORT}
        target: 'https://exercise-app.herokuapp.com',
        changeOrigin: true,
       
        secure: false
    }
  }
}
  // commonjsOptions: {
  //     esmExternals: true,
  //  }
})
