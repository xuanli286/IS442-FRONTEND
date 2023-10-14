<template>
    <div class="px-8 sm:px-12 py-11">
        <h3 class="text-white pb-11">
            Portfolio
        </h3>
        <div class="white-card">
            <div class="flex justify-between">
                <div>
                    <p class="my-4 text-gray-700">Created by: </p>
                    <p class="my-4 text-gray-700">Date created: </p>
                    <p class="my-4 text-gray-700">Portfolio Description: </p>
                    <p class="my-4 text-gray-700">Capital: </p>
                    <p class="my-4 text-gray-700">Unrealised PnL: </p>
                </div>
                <div class="float-right">$$$$</div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <tr>
                        <th>Stock</th>
                        <th>Sector</th>
                        <th>Price</th>
                        <th>Allocation</th>
                    </tr>
                    <tr v-for="log of filteredData.slice( (page-1)*6, page*6 )">
                        <td>{{ formatDate(log.dateTime) }}</td>
                        <td>{{ log.action }}</td>
                        <td>{{ log.info }}</td>
                        <td></td>
                    </tr>
                </table>             
            </div>
        </div>

        <Pagination class="mb-10 mt-7 float-right" :maxPage="Math.ceil(filteredData.length/6)" v-model="page"/>

    </div>
</template>

<script>
import { useUserStore } from "@/stores/useUserStore";
import axios from "../axiosConfig";
import { ref } from "vue";
import Pagination from '../components/Pagination.vue'

export default {
    name: "CommunityPortfolio",
    components: {
    Pagination,
    },
    setup() {
        const userID = useUserStore().loginUser.id;
        const testData = ref([]);
        console.log(userID);

        axios
            .get(`http://localhost:5000/accesslog/getlogs/${userID}`)
            .then((response) => {
                console.log(response.data);
                testData.value = response.data;

                // action: "CREATE";
                // dateTime: "2023-10-05T00:04:00.009722300";
                // info: "Created Portfolio";
                // ipAddress: "0:0:0:0:0:0:0:1";
                // success: true;
                // userId: "google-oauth2|117368012179621015773";
            })
            .catch((error) => {
                console.log(error.message);
            });

        return { userID, testData };
    },
    data() {
        return {
            start: "",
            end: "",
            page: 1,
        };
    },
    computed: {
        filteredData() {
            if (this.start && this.end) {
                return this.testData.filter(
                    (item) =>
                        new Date(item.dateTime.split("T")[0]).setHours(0) >=
                            new Date(this.start).setHours(0) &&
                        new Date(item.dateTime.split("T")[0]).setHours(0) <=
                            new Date(this.end).setHours(0)
                );
            } else {
                return this.testData;
            }
        },
    },
    watch: {
        start() {
            if (this.start && this.end) {
                if (this.start > this.end) {
                    this.end = this.start;
                }
            }
        },
        end() {
            if (this.start && this.end) {
                if (this.end < this.start) {
                    this.end = this.start;
                }
            }
        },
    },
    methods: {
        formatDate(dateTime) {
            if (!dateTime) return "";
            const date = new Date(dateTime);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
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
