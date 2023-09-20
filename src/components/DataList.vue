<template>
  <div class="relative">
    <!-- <i v-if="inputTxt && isActive" class="bi bi-x-circle-fill input-icon transition z-[2]" @click="clear"></i> -->
    <i class="bi bi-chevron-down input-icon transition z-[0]" :class="{ 'chevDown': isActive }"></i>
    <input list="stocks" class="input-datalist relative z-[1]" @focus="isActive = true" @blur="isActive = false" placeholder="Stock Ticker Symbol" @input="updateValue" v-model="inputTxt">
    <datalist id="stocks" class="input-grey">
    <option v-for="item of items" :key="item.id">{{ item }}</option>
    </datalist>
  </div>
</template>

<script>
export default {
  name: 'DataList',
  props: {
    items: {
      type: Array,
    },
    modelValue: {
      type: String,
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
//   methods: {
//     clear() {
//       this.inputTxt = "";
//     },
//   },
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
    @apply
    outline-none
  }
  .input-datalist::placeholder {
    @apply
    text-navy-800
  }
</style>