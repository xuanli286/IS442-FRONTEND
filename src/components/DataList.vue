<template>
  <div class="grid grid-cols-[auto,1fr] items-center">
    <div class="text-red-500 px-1" v-if="empty">
      <i class="bi bi-exclamation-circle aspect-square"></i>
    </div>
    <div class="relative">
      <i tabindex="0" v-if="modelValue && display" class="bi bi-x-circle-fill input-icon z-50 cursor-pointer" ref="close"></i>
      <i class="bi bi-chevron-down input-icon transition z-[0]" :class="{ 'chevDown': isActive }"></i>
      <input type="text" :class="{'placeholder:text-red-500': empty, 'placeholder:text-navy-950': !empty}" class="input-datalist relative z-[1]" @focus="isActive = true" @blur="handleBlur" placeholder="Symbol" :value="modelValue" @input="$emit('update:modelValue', $event.target.value);" ref="inputField">
      <ul tabindex="0" class="dropdown" :class="{ 'active': isActive }" ref="dropdown">
        <div v-for="(item, idx) of items.filter(item => item.toUpperCase().includes(modelValue.toUpperCase()))" :key="item.id">
          <li class="stock-option" @click="isActive=!isActive;selectOption(item);">
            {{ item }}
          </li>
          <div class="divider" v-if="idx != items.length-1"></div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps(['items', 'modelValue', 'empty'])
defineEmits(['update:modelValue', 'change'])
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
    handleBlur(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.relatedTarget)) {
        this.isActive = false;
        // console.log(event.relatedTarget)

        if (this.$refs.close && this.$refs.close.contains(event.relatedTarget)) {
          this.clear();
        }
        
        if (this.$refs.inputField) {
          if (!this.items.includes(this.$refs.inputField.value.toUpperCase())) {
            this.$emit('update:modelValue', '');
          } else {
            this.$emit('update:modelValue', this.$refs.inputField.value.toUpperCase());
            this.$emit('change', this.$refs.inputField.value.toUpperCase());
          }
        }
      }
    },
    clear() {
      this.$refs.inputField.value = "";
      this.$emit('update:modelValue', '');
      this.$emit('change', '');
    },
    selectOption(item) {
      this.$emit('update:modelValue', item);
      this.$emit('change', item);
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
    right-3
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
    placeholder:text-navy-950
  }
  /*.input-datalist::placeholder {
    @apply
    text-navy-800
  }*/
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
    rounded-bl-xl
    rounded-br-xl
    overflow-y-auto;
    overflow: hidden;
    max-height: 0;
    /*transition: max-height 0.3s ease-in-out, min-height 0.3s ease-in-out, padding 0.3s ease-in-out, border 0.3s ease-in-out;*/
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
    bg-gray-300
  }
  ::-webkit-scrollbar-thumb:hover {
    @apply
    bg-[#dbdee4]
  }
  /*
  ::-webkit-scrollbar-thumb {
    @apply
    bg-navy-300
    rounded-xl
  }
  ::-webkit-scrollbar-thumb:hover {
    @apply
    bg-navy-200
  }
  */
</style>