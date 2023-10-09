<template>
    <button v-if="type == 'c'" class="border border-white p-3 text-white text-sm rounded w-40 font-semibold" @click="handleEvent" @mouseenter="isHover=true" @mouseleave="isHover=false">
        <i v-if="isHover" class="fa-solid fa-folder-open mr-1 animate-bounce"></i>
        <i v-else class="fa-solid fa-folder-plus mr-1"></i>
        Create Portfolio
    </button>
    <button v-else-if="type == 'd'" class="bg-red-600 p-3 text-white text-sm rounded w-40 font-semibold" @click="handleEvent" @mouseenter="isHover=true" @mouseleave="isHover=false">
        <i v-if="isHover" class="fa-solid fa-trash-can animate-bounce mr-2"></i>
        <i v-else class="fa-regular fa-trash-can mr-2"></i>
        Delete Portfolio
    </button>
    <button v-else-if="type == 'e'" class="bg-green-600 p-3 text-white text-sm rounded w-40 font-semibold" @click="handleEvent" @mouseenter="isHover=true" @mouseleave="isHover=false">
        <i v-if="isHover" class="fa-solid fa-edit animate-bounce mr-2"></i>
        <i v-else class="fa-regular fa-edit mr-2"></i>
        Edit Portfolio
    </button>
</template>

<script setup>
    import { defineProps, ref } from 'vue';
    import { useRouter  } from "vue-router";

    const isHover = ref(false);

    const router = useRouter();
    
    const props = defineProps({
        type: {
            type: String,
            required: true,
        },
        id: {
            type: String,
        }
    })

    function handleEvent() {
        if (props.type == 'd') {
            // TO-DO
        }
        else if (props.type == 'c') {
            router.push({path: '/create'});
        } else if (props.type == 'e') {
            router.push({
                path: '/update',
                query: { pID: props.id }
            });
        }
    }
</script>