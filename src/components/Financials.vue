<template>

    <h4 class="text-white font-semibold">Income Statement</h4>
    <h4 class="text-white font-semibold">Balance Sheet</h4>

</template>


<script setup>
    import { defineProps } from 'vue';
    import axios from "axios";

    const props = defineProps({
      stock: {
        type: String,
        required: true,
      }
    })

</script>


<script>
    
    export default {
      components: {
        
      },
      data() {
          return {
            
              
          };
      },
      created() {

      }
        
    }
</script>

<style scoped>
  h4 {
    @apply
    text-2xl
  }
</style>