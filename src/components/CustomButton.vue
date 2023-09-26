<template>
    <button :class="isDelete ? 'bg-red-600' : 'border border-white'" class="p-3 text-white text-sm rounded w-40 font-semibold" @click="handleEvent" @mouseenter="isHover=true" @mouseleave="isHover=false">
        <span v-if="isDelete">
            <i v-if="isHover" class="fa-solid fa-trash-can animate-bounce mr-2"></i>
            <i v-else class="fa-regular fa-trash-can mr-2"></i>
            Delete Portfolio
        </span>
        <span v-else>
            <i v-if="isHover" class="fa-solid fa-folder-open mr-1 animate-bounce"></i>
            <i v-else class="fa-solid fa-folder-plus mr-1"></i>
            Create Portfolio
        </span>
    </button>
</template>

<script setup>
    import { defineProps, ref } from 'vue';
    import { useRouter  } from "vue-router";

    const isHover = ref(false);

    const router = useRouter();
    
    const props = defineProps({
        isDelete: {
            type: Boolean,
            required: true,
        },
    })

    function handleEvent() {
        if (props.isDelete) {
            // TO-DO
        }
        else {
            router.push({path: '/create'});
        }
    }
</script>