import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Crea la aplicación Vue
const app = createApp(App);
// Crea el store de Pinia
const pinia = createPinia();
// Usa el plugin para persistir el estado de Pinia
pinia.use(piniaPluginPersistedstate);

// Usa el router
app.use(router);
// Usa el plugin de Vue Query
app.use(VueQueryPlugin);
// Usa el store de Pinia
app.use(pinia);
// Usa el plugin de Toast
app.use(Toast);

// Monta la aplicación en el elemento con el id "app"
app.mount('#app');
