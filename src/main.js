import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createAuth0 } from '@auth0/auth0-vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const pinia = createPinia()

const app = createApp(App)
    .use(router)
    .use(pinia)
    .use(createAuth0({
        domain: process.env.VUE_APP_AUTH0_DOMAIN,
        clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
        authorizationParams: {
          redirect_uri: "http://localhost:8080/",
          audience: process.env.VUE_APP_AUTH0_AUDIENCE,
        }
    }))
app.mount('#app')
