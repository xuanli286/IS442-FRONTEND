<template>
  <div class="relative">
    <div class="sep"></div>
    <i class="bi bi-currency-dollar curr"></i>
    <input type="number" placeholder="Enter amount" class="input-grey" @input="updateValue">
  </div>
</template>

<script>
export default {
  name: 'CapitalInput',
  props: {
    modelValue: {
      type: String
    },
  },
  setup(props, context) {
    const updateValue = (event) => {
      context.emit('update:modelValue', event.target.value);
    }

    return { updateValue }
  },
  data(){
    return {
      isActive: false,
      inputTxt: "",
    }
  },
  methods: {
    clear() {
      this.inputTxt = "";
    },
  },
}
</script>

<style scoped>
  .curr {
    top: calc(50% - 12px);
    @apply
    absolute
    left-[12px]
    text-white
  }
  .sep {
    @apply
    absolute
    rounded-s-xl
    left-0
    w-[40px]
    h-full
    bg-navy-950
  }
</style>