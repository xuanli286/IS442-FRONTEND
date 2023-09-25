<template>
    <div class="text-white">
      <RouterLink to="/create" class="underline">Create Portfolio</RouterLink>
    </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();
import axios from "axios";
import { ref, onMounted } from "vue";

if (isAuthenticated) {
  onMounted(async () => {
    const data = {
      name: user.value.given_name || user.value.family_name ? user.value.name : user.value.nickname,
      email: user.value.email,
      id: user.value.sub.replace('|', '_'),
      picture: user.value.picture,
      updatedAt: user.value['updated_at']
    }
    // console.log(data)
    axios.post(`http://localhost:5000/customer/`, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
  });
}
</script>