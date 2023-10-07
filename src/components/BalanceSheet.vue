<template>

    <div class="text-xs lg:text-base">
        <div class="col-span-3 mb-2">
            <h5 class="italic text-gray-600 text-sm">All numbers in thousands</h5>
        </div>
        <div class="flex">
            <div class="flex-none">
                <table class="border-y-2 border-l-2 border-r-4 border-r-neutral-400 border-navy-950">
                    <thead>
                        <tr>
                            <td class="font-bold sep">Breakdown</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="breakdown in breakdowns">
                            <td :class="[imptBreakdown.includes(breakdown) ? 'font-semibold px-2' : 'pl-10 pr-2', inside.includes(breakdown) ? 'pl-16' : '']">
                                <!-- <i class="bi bi-chevron-down text-sm" :hidden="!imptBreakdown.includes(breakdown)"></i> -->
                                {{ breakdown }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-span-2 overflow-x-auto" v-if="loaded">
                <table class="table-fixed border-y-2 border-r-2 border-l-0 border-navy-950 text-center">
                    <thead>
                        <tr class="font-bold">
                            <td class="sep" v-for="formattedDate of formattedDates" :key="formattedDate">{{formattedDate}}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(val, breakdown) in breakdowns" :key="breakdown">
                            <td class="sep" v-for="i of indexes" :key="i">{{ (parseInt(annualReports[i][breakdown])/1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

</template>




<script>
  import axios from "axios";
  export default {
    props: {
      stock: {
        type: String,
        required: true,
      }
    },
    data() {
        return {
            breakdowns: {
                totalAssets: "Total Assets",
                totalCurrentAssets : "Total Current Assets",
                cashAndShortTermInvestments : "Cash, Cash Equivalent & Short Term Investments",
                cashAndCashEquivalentsAtCarryingValue : "Cash & Cash Equivalent",
                shortTermInvestments : "Other Short-Term Investment",
                // currentNetReceivables : "Net Receivables",
                inventory : "Inventory",
                otherCurrentAssets : "Other Current Assets",
                totalNonCurrentAssets : "Total Non Current Assets",
                // goodwill : "Goodwill",
                // intangibleAssetsExcludingGoodwill : "Other Intangible Assets",
                totalLiabilities : "Total Liabilities",
                totalCurrentLiabilities : "Total Current Liabilities",
                // shortTermDebt : "Current Debt",
                // currentAccountsPayable : "Accounts Payable",
                totalNonCurrentLiabilities : "Total Non-Current Liabilities",
                // longTermDebtNoncurrent : "Long-Term Debt",
                otherNonCurrentLiabilities : "Other Non-Current Liabilities",
                totalShareholderEquity : "Total Stockholder Equity",
                commonStock : "Common Stock",
                retainedEarnings : "Retained Earnings"
            },
            annualReports: [],
            quarterlyReports: [],
            loaded: false,
            indexes: [0,1,2,3],
            formattedDates: [],
            imptBreakdown: [
                "Total Assets", 
                "Total Current Assets", 
                "Total Non Current Assets", 
                "Total Liabilities",
                "Total Current Liabilities",
                "Total Non-Current Liabilities",
                "Total Stockholder Equity"
            ],
            inside: [
                "Cash & Cash Equivalent", "Other Short-Term Investment"
            ],
            
        };
    },
    created() {

        axios.get(`http://localhost:5000/stockprice/balancesheet/${this.stock}`)
        .then(response => {

            console.log(response.data.annualReports)
            const annualResponse = response.data.annualReports;
            const quarterlyResponse = response.data.quarterlyReports;

            this.annualReports = annualResponse;

            this.quarterlyReports = quarterlyResponse;

            for (let i=0; i < annualResponse.length - 1; i++) {
                let fiscalDate = annualResponse[i].fiscalDateEnding.split("-")
                let day = fiscalDate[2]
                let month = fiscalDate[1]
                let year = fiscalDate[0]
                this.formattedDates.push(`${day}/${month}/${year}`)
            }

            this.loaded = true;


        })
        .catch(error => {
            console.error(error)
        })



    }
      
  }
</script>

<style scoped>
  h4 {
    @apply
    text-2xl
  }
  .sep {
    @apply
    px-3
  }
  td {
    @apply
    border
    border-navy-950
    py-1
  }
</style>