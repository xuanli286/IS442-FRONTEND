<template>
    <div class="grid grid-cols-[auto,auto] justify-between mx-8 sm:mx-12 mt-11 mb-8">
        <div>
            <h3 class="text-white mb-4">{{ pfData.portfolioName }}</h3>
            <div class="rounded-full bg-gray-300 w-fit p-2">by {{ creator }}</div>
        </div>
        <RouterLink to="/community" class="self-end">
            <button class="btn-outline-white h-fit font-bold">
                <i class="bi bi-arrow-left mr-2 -ml-1"></i>Back
            </button>
        </RouterLink>
    </div>
    <div class="px-8 sm:px-12 pb-11 font-inter" v-if="pfData.portfolioName">
        <SummarizedValue :portfolio="pfData" />
        <Portfolio :portfolio="pfData" />
    </div>
</template>

<script>
import axios from "../axiosConfig";
import { ref } from "vue";
import SummarizedValue from '../components/SummarizedValue.vue';
import Portfolio from "../components/Portfolio.vue";

export default {
    name: "CommunityPortfolio",
    components: {
        SummarizedValue,
        Portfolio
    },
    data() {
        return {
            pID: this.$route.query.pID,
            page: 1,
            pfData: {},
            creator: "",
        };
    },
    created() {
        if (this.pID) {
            this.populate();
        } else {
            this.$router.go(-1);
        }
    },
    methods: {
        populate() {
            axios.get(`http://localhost:5000/portfolio/${this.pID}`)
            .then((response) => {
                if (response.data.public) {
                    this.pfData = response.data;
                    axios.get(`http://localhost:5000/customer/${response.data.userId}`)
                    .then((response) => {
                        this.creator = response.data.customerData.name;
                        console.log(this.pfData);
                    })
                    .catch((error) => {
                        this.creator = this.pfData.userId;
                    })
                }
            })
            .catch((error) => {
                console.log(error.message);
                this.$router.go(-1);
            })
        },
    },
};
</script>

<style scoped>
h3 {
    @apply text-2xl;
}

.white-card {
    @apply bg-white
    rounded-md
    px-8
    py-12;
}

input::-webkit-datetime-edit-day-field:focus,
input::-webkit-datetime-edit-month-field:focus,
input::-webkit-datetime-edit-year-field:focus {
    @apply bg-[#8ba7ed];
}

input[type="date"] {
    @apply rounded-xl
    border-2
    border-gray-300
    p-3
    text-navy-950;
}

table {
    @apply border-x-2
    border-t-2
    border-gray-200
    rounded-xl;
}

table tr {
    @apply border-b-2
    border-gray-200;
}

table th {
    @apply font-bold
    bg-gray-100
    p-4
    w-1/4;
}

table td {
    @apply p-4
    text-center;
}

.badge {
    @apply py-1
    font-bold
    w-[100px]
    mx-auto
    rounded-md
    text-white
    text-sm;
}
</style>
