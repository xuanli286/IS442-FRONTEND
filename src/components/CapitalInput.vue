<template>
  <div class="flex">
    <div class="flex-left curr">$</div>
    <input type="number" placeholder="Enter amount" class="flex-right input-grey w-full mobile:w-[200px]" :class="{'invalid': !valid}" :value="modelValue" @input="updateValue">
  </div>
</template>

<script>
export default {
  name: 'CapitalInput',
  props: {
    modelValue: {
      type: Number
    },
    valid: {
      type: Boolean
    },
  },
  setup(props, context) {
    const updateValue = (event) => {
      context.emit('update:modelValue', Number(event.target.value));
    }

    return { updateValue }
  },
  data(){
    return {
    }
  },
}
</script>

<style scoped>
  input[type="number"] {
    @apply
    rounded-s-none !important
  }
  input[type="number"]:focus {
    @apply
    outline-none !important
  }
  .curr {
    @apply
    flex
    justify-center
    items-center
    rounded-s-xl
    bg-navy-950
    text-white
    px-5
    py-2
  }
</style>