<template>
  <div class="flex">
    <button class="btn-search rounded-s-xl cursor-default flex-left">
      <i class="bi bi-search"></i>
    </button>

    <input type="text" class="input-search" placeholder="Search" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" ref="inputField">
    
    <button class="btn-search rounded-e-xl cursor-default flex-right cursor-pointer" @click="$emit('clear');">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue', 'clear'])
</script>

<script>
export default {
  name: 'SearchInput',
  data(){
    return {
    }
  },
  methods: {
    
  },
}
</script>

<style scoped>
  input[type="text"].input-search {
    @apply
    bg-white
    pr-4
    py-3
    text-navy-950
    focus:outline-none
    w-full
  }

  input[type="text"]::placeholder.input-search {
    @apply
    text-gray-600
    italic
  }
  
  .btn-search {
    @apply
    -ml-[1px]
    bg-white
    px-4
    py-3
  }
</style>