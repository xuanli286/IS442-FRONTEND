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
        domain: "dev-4pxn4zbtcuoww57l.us.auth0.com",
        clientId: "vO8XnhCHlQMt0tgztXf16ODRMqm5on7F",
        authorizationParams: {
          redirect_uri: "http://localhost:8080/",
          audience: "https://dev-4pxn4zbtcuoww57l.us.auth0.com/api/v2/",
        }
    }))
app.mount('#app')
