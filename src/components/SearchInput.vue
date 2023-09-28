<template>
  <div class="flex">
    <input type="text" class="input-search flex-left" placeholder="Search" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" ref="inputField">
    <button class="btn-search cursor-default">
      <i class="bi bi-search"></i>
    </button>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
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
    rounded-s-xl
    px-4
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
    rounded-e-xl
  }
</style>