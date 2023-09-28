<template>
  <div class="px-8 sm:px-12 py-11">
    <h3 class="text-white pb-11">User Logs <i class="bi bi-file-earmark-text"></i></h3>
    <div class="white-card">
        <div class="text-gray-400 pb-2">Select date range</div>
        <div class="mb-8">
            <input type="date" class="mr-3" v-model="start"> – <input type="date" class="ml-3" v-model="end"> <button class="btn-navy ml-3" @click="start=''; end='';">Clear</button>
        </div>

        <table class="w-full">
            <tr>
                <th>Date & Time</th>
                <th>Action</th>
                <th>Status</th>
            </tr>
            <tr v-for="log of filteredData">
                <td>{{ log.dateTime }}</td>
                <td>{{ log.action }}</td>
                <td>
                    <div class="badge" :class="{'bg-[#28C191]': log.status, 'bg-[#FE4D35]': !log.status}">
                        {{ log.status ? "Success" : "Failure" }}
                    </div>
                </td>
            </tr>
        </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserLogs',
  data(){
    return {
        start: "",
        end: "",
        testData: [
            {dateTime: "09/11/2023  12:19", action: "BUY AAPL", status: true},
            {dateTime: "09/13/2023  13:19", action: "BUY TSLA", status: false},
            {dateTime: "09/14/2023  11:19", action: "BUY DDW", status: true},
            {dateTime: "09/16/2023  08:19", action: "BUY AOS", status: false},
        ]
    }
  },
  computed: {
    filteredData() {
        if (this.start && this.end) {
            return this.testData.filter((item) => ( new Date(item.dateTime.split(" ")[0]) >= new Date(this.start).setHours(0)) && (new Date(item.dateTime.split(" ")[0]) <= new Date(this.end).setHours(0)) );
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
  },
}
</script>

<style scoped>
  h3 {
    @apply
    text-2xl
  }

  .white-card {
    @apply
    bg-white
    rounded-md
    px-8
    py-12
}

  input::-webkit-datetime-edit-day-field:focus,
  input::-webkit-datetime-edit-month-field:focus,
  input::-webkit-datetime-edit-year-field:focus {
    @apply
    bg-[#8ba7ed]
  }

  input[type="date"] {
    @apply
    rounded-xl
    border-2
    border-gray-300
    p-3
    text-navy-950
  }

  table {
    @apply
    border-x-2
    border-t-2
    border-gray-200
    rounded-xl
  }

  table tr {
    @apply
    border-b-2
    border-gray-200
  }

  table th {
    @apply
    font-bold
    bg-gray-100
    p-4
    w-1/3
  }

  table td {
    @apply
    p-4
    text-center
  }

  .badge {
    @apply
    py-1
    font-bold
    w-[100px]
    mx-auto
    rounded-md
    text-white
    text-sm
  }
</style>