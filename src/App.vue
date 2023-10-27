<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <div class="grow bg-navy-950" v-if="(!isLoading && display) || access.includes(route.path)">
      <RouterView :key="$route.fullPath"/>
    </div>
    <div class="flex grow bg-navy-950 justify-center items-center flex-col" v-else>
      <div class="loading-animation mb-5"></div>
      <h1 class="text-4xl text-white">Loading...</h1>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

import axios from "axios";
import { useUserStore } from "@/stores/useUserStore";
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuth0 } from "@auth0/auth0-vue";
import { useRoute, useRouter } from "vue-router";

const { user, isAuthenticated, isLoading } = useAuth0();
const route = useRoute();
const router = useRouter();

const store = useUserStore();
const {
    loginUser,
} = storeToRefs(store);

const display = ref(false);

const access = ["/", "/verify"];

watch(isLoading, (newIsLoading, oldIsLoading) => {
  if (!newIsLoading & !(route.path in access)) {
    if (isAuthenticated.value) {
      const data = {
        name: user.value.given_name || user.value.family_name ? user.value.name : user.value.nickname,
        email: user.value.email,
        id: user.value.sub,
        picture: user.value.picture,
        updatedAt: user.value['updated_at'],
        totalCapitalAvailable: 10000,
      };
      axios.get(`http://localhost:5000/customer/${data.id}`)
      .then((response) => {
        loginUser.value = response.data.customerData;
        localStorage.setItem('token', response.data.token)
        
        display.value = true;
      })
      .catch((error) => {
        if (error.message.includes('404')) {
          axios.post(`http://localhost:5000/customer/`, data)
            .then((response) => {
              loginUser.value = data;
              localStorage.setItem('token', response.data.token)

              display.value = true;
            })
            .catch((error) => {
              console.log(error.message);
            })
        }
      })
    } else {
      router.push("/");
    }
  }
});

</script>

<style scoped>
  .loading-animation {
    animation: spin 1s linear infinite;
    @apply
    w-[50px]
    h-[50px]
    border-4
    border-gray-600
    border-t-gray-200
    rounded-[50%]
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>