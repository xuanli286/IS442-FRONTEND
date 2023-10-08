<template>

    <div class="text-xs md:text-base">
        <div class="flex mb-2 items-center justify-between">
            <h5 class="italic text-gray-600 md:text-sm">All numbers in thousands</h5>
            <div class="flex items-center mr-1">
                <button class="btn font-semibold" @click="pickedView('annualReports')" :class="selectedView == 'annualReports' ? 'text-navy-950' : 'text-gray-400'">Annually</button>
                <p class="text-navy-950 font-bold mx-2">|</p>
                <button class="btn font-semibold" @click="pickedView('quarterlyReports')" :class="selectedView == 'quarterlyReports' ? 'text-navy-950' : 'text-gray-400'">Quarterly</button>
            </div>
        </div>
        <div class="flex">
            <div class="flex-none">
                <table class="border-y-2 border-l-2 border-r-4 border-r-neutral-400 border-navy-950">
                    <thead>
                        <tr>
                            <td class="font-bold pl-2">Breakdown</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="breakdown in breakdowns[selectedFinancials]">
                            <td :class="[imptBreakdown.includes(breakdown) ? 'font-semibold px-2' : 'pl-10 pr-2', 
                                        inside.includes(breakdown) ? 'pl-16' : ''
                                        ]">
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
                        <tr v-for="(val, breakdown) in breakdowns[selectedFinancials]" :key="breakdown">
                            <td class="sep" v-for="i of indexes" :key="i">{{ (parseInt(viewReports[i][breakdown])/1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}}</td>
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
      },
      selectedFinancials: {
        type: String,
        required: true
      }
    },
    data() {
        return {
            breakdowns: {
                balancesheet: {
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
                incomestatement: {
                    totalRevenue : "Total Revenue",
                    costOfRevenue : "Cost of Revenue",
                    grossProfit : "Gross Profit",
                    operatingExpenses : "Operating Expenses",
                    sellingGeneralAndAdministrative : "Selling General & Administrative",
                    researchAndDevelopment : "Research & Development",
                    operatingIncome : "Operating Income/Loss",
                    interestExpense : "Interest Expense",
                    incomeBeforeTax : "Income before Tax",
                    incomeTaxExpense : "Income Tax Expense",
                    netIncomeFromContinuingOperations : "Net Income"
                }
                
            },
            viewReports: [],
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
                "Total Stockholder Equity",
                "Total Revenue",
                "Cost of Revenue",
                "Gross Profit",
                "Operating Expenses",
                "Operating Income/Loss",
                "Interest Expense",
                "Income before Tax",
                "Income Tax Expense",
                "Net Income"
            ],
            inside: [
                "Cash & Cash Equivalent", "Other Short-Term Investment"
            ],
            selectedView : "annualReports"
            
        };
    },
    created() {

        this.loadFinancials()

    },
    methods: {
        pickedView(sView) {
            if (this.selectedView === sView) {
                this.selectedView = null
            } else {
            this.selectedView = sView
            }
        },
        loadFinancials() {

            this.formattedDates = []
            
            console.log(this.selectedView)

            axios.get(`http://localhost:5000/stockprice/${this.selectedFinancials}/${this.stock}`)
            .then(response => {

                console.log(response.data.annualReports)
                const viewResponse = response.data[this.selectedView];
                
                this.viewReports = viewResponse;

                for (let i=0; i < 4; i++) {
                    let fiscalDate = viewResponse[i].fiscalDateEnding.split("-")
                    let day = fiscalDate[2]
                    let month = fiscalDate[1]
                    let year = fiscalDate[0]
                    this.formattedDates.push(`${day}/${month}/${year}`)

                    if (this.selectedFinancials == "incomestatement") {
                        this.viewReports[i].operatingExpenses = parseInt(viewResponse[i].sellingGeneralAndAdministrative) + parseInt(viewResponse[i].researchAndDevelopment);
                    }

                }
                
                this.loaded = true;


            })
            .catch(error => {
                console.error(error)
            })

        }
    },
    watch: {
        selectedFinancials: 'loadFinancials',
        selectedView: "loadFinancials"
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
    text-navy-950
  }
</style>