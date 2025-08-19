import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { VueQueryPlugin } from '@tanstack/vue-query';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import './globals.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(VueQueryPlugin);

app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
  ripple: true,
});

app.mount('#app');
