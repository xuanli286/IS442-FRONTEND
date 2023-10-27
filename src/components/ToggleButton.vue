<template>
  <div class="flex mb-8 rounded-xl w-fit relative overflow-hidden">
    <button :disabled="isDisabled" class="btn-toggle rounded-s-xl float-left w-1/2" :class="{'text-white': isLeft}" @click="$emit('update:modelValue', true)">{{ left }}</button>
    <button :disabled="isDisabled" class="btn-toggle rounded-e-xl float-right w-1/2" :class="{'text-white': !isLeft}" @click="$emit('update:modelValue', false)">{{ right }}</button>

    <div class="sliding-block" :class="{ 'public': modelValue, 'private': !modelValue, 'disabled': isDisabled }"></div>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'left', 'right', 'isDisabled'])
defineEmits(['update:modelValue'])
</script>

<script>
export default {
  name: 'ToggleButton',
  data(){
    return {
      isLeft: this.modelValue,
    }
  },
  watch: {
    modelValue: {
      handler() {
        setTimeout(() => {
          this.isLeft = this.modelValue;
        }, "100");
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
  .btn-toggle {
    @apply
    text-center
    font-semibold
    px-8
    py-4
    border-2
    border-navy-950
    z-10
    disabled:border-gray-500
  }
  .sliding-block {
    transition: transform 0.5s;
    @apply
    absolute
    top-0
    left-0
    bg-navy-950
    w-1/2
    h-full
    z-0
  }
  .sliding-block.disabled {
    @apply
    bg-gray-500
  }

  .sliding-block.public {
    transform: translateX(0);
  }
  .sliding-block.private {
    transform: translateX(100%);
  }
</style>