<template>
  <div class="flex space-x-2 w-fit bg-white rounded-md p-2">
    <button class="btn-white" @click="start">
      <i class="bi bi-chevron-bar-left"></i>
    </button>
    <button class="btn-white" @click="decrement">
      <i class="bi bi-chevron-left"></i>
    </button>
    <input type="number" class="input-search" min="1" :max="maxPage" :value="modelValue" @blur="registerValue" @keydown.enter="registerValue" ref="inputField">
    <div class="flex items-center">of {{ maxPage }}</div>
    <button class="btn-white">
      <i class="bi bi-chevron-right" @click="increment"></i>
    </button>
    <button class="btn-white" @click="end">
      <i class="bi bi-chevron-bar-right"></i>
    </button>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'maxPage'])
defineEmits(['update:modelValue'])
</script>

<script>
export default {
  name: 'Pagination',
  data(){
    return {
    }
  },
  methods: {
    start() {
        this.$emit('update:modelValue', 1);
    },
    decrement() {
        if (this.modelValue > 1) {
            this.$emit('update:modelValue', this.modelValue - 1);
        }
    },
    increment() {
        if (this.modelValue < this.maxPage) {
            this.$emit('update:modelValue', this.modelValue + 1);
        }
    },
    end() {
        this.$emit('update:modelValue', this.maxPage);
    },
    registerValue() {
        if (this.modelValue < 1) {
            this.$emit('update:modelValue', 1);
        } else if (this.modelValue > this.maxPage) {
            this.$emit('update:modelValue', this.maxPage);
        } else if ( !(this.modelValue >= 1 && this.modelValue <= this.maxPage) || isNaN(Number(this.modelValue)) ) {
            this.$emit('update:modelValue', 1);
        } else {
            this.$emit('update:modelValue', this.$refs.inputField.value);
        }
    },
  },
}
</script>

<style scoped>
  input[type="number"].input-search {
    @apply
    border-[1px]
    border-gray-200
    bg-white
    rounded-md
    my-1
    text-center
    text-navy-950
    focus:outline-none
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>