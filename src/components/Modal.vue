<template>
  <Transition name="modal-fade">
    <div class="overlay" v-if="modelValue">
        <div class="modal-card" ref="modal" :style="{'width': width, 'height': height}">
            <button class="absolute right-4 top-4 hover:text-gray-400" @click="$emit('update:modelValue', false)">
                <i class="bi bi-x-lg"></i>
            </button>
            <slot></slot>
        </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modelValue: {
        type: Boolean,
    },
    width: {
        type: String,
    },
    height: {
        type: String,
    }
  },
  data(){
    return {
    }
  },
  watch: {
    modelValue() {
        if (this.modelValue) {
            setTimeout(() => {
                document.addEventListener('click', this.checkClick);
            },100);
        } else {
            document.removeEventListener('click', this.checkClick);
        }
    }
  },
  methods: {
    checkClick(event) {
        if (this.$refs.modal && !this.$refs.modal.contains(event.target) ) {
            this.$emit('update:modelValue', false);
        }
    },
  },
}
</script>

<style scoped>
.overlay {
    @apply
    fixed
    w-[100vw]
    h-[100vh]
    bg-black
    bg-opacity-50
    top-0
    left-0
    z-[2147483647]
}
.modal-card {
    @apply
    fixed
    top-1/2
    bottom-1/2
    left-1/2
    right-1/2
    -translate-x-1/2
    -translate-y-1/2
    bg-white
    rounded-md
    px-8
    pt-12
    pb-8
    border-2
    shadow-lg
    overflow-auto
}
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>