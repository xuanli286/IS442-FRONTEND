<template>
  <div class="relative">
    <i v-if="modelValue && display" class="bi bi-x-circle-fill input-icon z-50 cursor-pointer" @click="clear"></i>
    <i class="bi bi-chevron-down input-icon transition z-[0]" :class="{ 'chevDown': isActive }"></i>
    <input type="text" class="input-datalist relative z-[1]" @focus="isActive = true" placeholder="Symbol" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" ref="inputField">
    <ul class="dropdown" :class="{ 'active': isActive }" ref="dropdown">
      <div v-for="(item, idx) of items.filter(item => item.toLowerCase().includes(modelValue.toLowerCase()))" :key="item.id">
        <li class="stock-option" @click="isActive=!isActive;selectOption(item);">
          {{ item }}
        </li>
        <div class="divider" v-if="idx != items.length-1"></div>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
  defineProps(['items', 'modelValue'])
  defineEmits(['update:modelValue'])
</script>

<script>
export default {
  name: 'DataList',
  data(){
    return {
      isActive: false,
      display: false,
    }
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (this.$refs.inputField && this.$refs.dropdown && !this.$refs.inputField.contains(event.target) && !this.$refs.dropdown.contains(event.target)) {
        this.isActive = false;
      }
    });
  },
  watch: {
    isActive() {
      if (!this.isActive) {
        this.display = false;
      } else {
        this.display = true;
      }
    },
  },
  methods: {
    clear() {
      setTimeout(() => {
        this.$emit('update:modelValue', '');
        this.$refs.inputField.value = '';
        this.$refs.inputField.dispatchEvent(new Event('input', { bubbles: true }));
      }, 200);
    },
    selectOption(item) {
      setTimeout(() => {
        this.$emit('update:modelValue', item)
        this.$refs.inputField.value = item;
        this.$refs.inputField.dispatchEvent(new Event('input', { bubbles: true }));
      }, 100);
    }
  },
}
</script>

<style scoped>
  input::-webkit-calendar-picker-indicator {
    display: none !important;
  }
  .input-icon {
    top: calc(50% - 12px);
    @apply
    absolute
    right-5
    cursor-pointer
  }
  .chevDown {
    @apply
    rotate-180
  }
  .input-datalist {
    @apply
    bg-transparent
    rounded-xl
    p-3
    w-full
    text-navy-950
  }
  .input-datalist:focus {
    background-color: rgb(0, 0, 0, 0.1);
    outline: 2px solid;
    @apply
    outline-navy-950
    -outline-offset-2
    rounded-b-none
  }
  .input-datalist::placeholder {
    @apply
    text-navy-800
  }
  .dropdown {
    @apply
    absolute
    top-[48px]
    left-0
    bg-gray-100
    w-full
    text-start
    z-50
    border-x-2
    border-transparent
    overflow-y-auto;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.2s ease-in-out, min-height 0.2s ease-in-out, padding 0.2s ease-in-out, border 0.2s ease-in-out;
  }
  .divider {
    @apply
    h-[1px]
    bg-[#cbcdcf]
    mx-3
  }
  .dropdown.active {
    @apply
    min-h-fit
    max-h-[153px]
    border-x-2
    border-b-2
    border-navy-950
    rounded-bl-xl
    rounded-br-xl
    overflow-y-auto
  }
  .stock-option {
    @apply
    cursor-pointer
    p-3
  }
  .stock-option:hover {
    @apply
    bg-gray-200
  }

  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    @apply
    bg-transparent
  }
  ::-webkit-scrollbar-thumb {
    @apply
    bg-navy-300
    rounded-xl
  }
  ::-webkit-scrollbar-thumb:hover {
    @apply
    bg-navy-200
}
</style>