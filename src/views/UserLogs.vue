<template>
    <div class="px-8 sm:px-12 py-11">
        <h3 class="text-white pb-11">
            User Logs <i class="bi bi-file-earmark-text"></i>
        </h3>
        <div class="white-card">
            <div class="text-gray-400 pb-2">Select date range</div>
            <div class="mb-8 grid gap-y-5 sm:block">
                <label>
                    <span class="inline sm:hidden text-gray-400">From: </span
                    ><input type="date" class="w-fit sm:mr-3" v-model="start" />
                </label>

                <span class="hidden sm:inline"> – </span>

                <label>
                    <span class="inline mr-5 sm:hidden text-gray-400">To: </span
                    ><input type="date" class="sm:ml-3" v-model="end" />
                </label>

                <button
                    class="btn-navy sm:ml-3 w-fit"
                    @click="
                        start = '';
                        end = '';
                    "
                >
                    Clear
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <tr>
                        <th>Date & Time</th>
                        <th>Action</th>
                        <th>Info</th>
                        <th>Status</th>
                    </tr>
                    <template v-if="filteredData.length != 0">
                        <tr v-for="log of filteredData.slice( (page-1)*6, page*6 )" :key="log">
                            <td>{{ formatDate(log.dateTime) }}</td>
                            <td>{{ log.action }}</td>
                            <td>{{ formatInfo(log.info) }}</td>
                            <td>
                                <div
                                    class="badge"
                                    :class="{
                                        'bg-[#28C191]': log.success,
                                        'bg-[#FE4D35]': !log.success,
                                    }"
                                >
                                    {{ log.success ? "Success" : "Failure" }}
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="4">No logs available.</td>
                    </tr>
                </table>             
            </div>
        </div>

        <Pagination class="mb-10 mt-7 float-right" :maxPage="Math.max(1, Math.ceil(filteredData.length/6))" v-model="page"/>

    </div>
</template>

<script>
import { useUserStore } from "@/stores/useUserStore";
import axios from "../axiosConfig";
import { ref } from "vue";
import Pagination from '../components/Pagination.vue'

export default {
    name: "UserLogs",
    components: {
    Pagination,
    },
    setup() {
        const userID = useUserStore().loginUser.id;
        const testData = ref([]);

        axios
            .get(`http://localhost:5000/accesslog/getlogs/${userID}`)
            .then((response) => {
                testData.value = response.data;
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
        formatInfo(info) {
            if (info.startsWith("Added x") || info.startsWith("Deleted x")) {
                const value = info.match(/x(.*?)\s/)[1];
                return info.replace(value, Number(value).toFixed(2));
            }
            return info;
        },
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
