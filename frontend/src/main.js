import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'
import router from './router'
import VueAxios from 'vue-axios';
import axios from 'axios';
import { createPinia } from "pinia";

const app = createApp(App);

app.use(createPinia());
app.use(router,VueAxios, axios)

app.mount('#app');
