<template>
  <div>
    <h2>User Profile</h2>
    <pre class="text-white" v-if="isAuthenticated">
        {{ user }}
    </pre>
    <img :src="user.picture" alt="">
  </div>
</template>
<script setup>
  import { useAuth0 } from '@auth0/auth0-vue';
  const { user, isAuthenticated } = useAuth0();
  console.log(user)
</script>