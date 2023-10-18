<template>

    <div class="white-card">
        <div class="mb-6 items-center">
            <button class="btn text-xs md:text-base font-semibold mr-5 pb-1" @click="pickedFinancials('incomestatement')" :class="{'border-b-4 border-navy-950' : financial == 'incomestatement'}">Income Statement</button>
            <button class="btn text-xs md:text-base font-semibold pb-1" @click="pickedFinancials('balancesheet')" :class="{'border-b-4 border-navy-950' : financial == 'balancesheet'}">Balance Sheet</button>
        </div>
        <div class="text-xs md:text-sm lg:text-base">
            <div class="flex mb-2 items-center justify-between">
                <h5 class="italic text-gray-600 md:text-sm">
                    All numbers in thousands
                </h5>
                <div class="flex items-center mr-1 font-semibold">
                    <button
                        class="btn"
                        @click="pickedView('annualReports')"
                        :class="selectedView == 'annualReports' ? 'text-navy-950' : 'text-gray-400'"
                    >
                        Annually
                    </button>
                    <p class="text-navy-950 font-bold mx-2">|</p>
                    <button
                        class="btn"
                        @click="pickedView('quarterlyReports')"
                        :class="selectedView == 'quarterlyReports' ? 'text-navy-950' : 'text-gray-400'"
                    >
                        Quarterly
                    </button>
                </div>
            </div>

            <div class="flex">
                <div>
                    <table class="border-y-2 border-l-2 border-r-4 border-r-neutral-400 border-navy-950">
                        <thead>
                            <tr>
                                <td class="font-bold pl-2">Breakdown</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="breakdown in breakdowns[financial]">
                                <td
                                    class="max-w-[230px] truncate ... md:max-w-full"
                                    :class="[
                                        imptBreakdown.includes(breakdown) ? 'font-semibold px-2' : 'pl-10 pr-2',
                                        inside.includes(breakdown) ? 'pl-16' : '',
                                    ]"
                                >
                                    {{ breakdown }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="overflow-hidden" v-if="loaded">
                    <div class="overflow-x-auto">
                        <table class="table-auto border-y-2 border-r-2 border-l-0 border-navy-950 text-center">
                            <thead>
                                <tr class="font-bold">
                                    <td class="sep w-screen" v-for="formattedDate of formattedDates" :key="formattedDate">
                                        {{ formattedDate }}
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(val, breakdown) in breakdowns[financial]" :key="breakdown">
                                    <td
                                        class="sep"
                                        v-for="(item, index) in indexes"
                                        :key="index"
                                    >
                                        {{
                                            (
                                                parseInt(
                                                    viewReports[item][breakdown]
                                                ) / 1000
                                            ).toLocaleString("en-US", {
                                                maximumFractionDigits: 0,
                                            })
                                        }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from "../axiosConfig";

export default {
    props: {
        stock: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            breakdowns: {
                balancesheet: {
                    totalAssets: "Total Assets",
                    totalCurrentAssets: "Total Current Assets",
                    cashAndShortTermInvestments:
                        "Cash, Cash Equivalent & Short Term Investments",
                    cashAndCashEquivalentsAtCarryingValue:
                        "Cash & Cash Equivalent",
                    shortTermInvestments: "Other Short-Term Investment",
                    inventory: "Inventory",
                    otherCurrentAssets: "Other Current Assets",
                    totalNonCurrentAssets: "Total Non Current Assets",
                    totalLiabilities: "Total Liabilities",
                    totalCurrentLiabilities: "Total Current Liabilities",
                    totalNonCurrentLiabilities: "Total Non-Current Liabilities",
                    otherNonCurrentLiabilities: "Other Non-Current Liabilities",
                    totalShareholderEquity: "Total Stockholder Equity",
                    commonStock: "Common Stock",
                    retainedEarnings: "Retained Earnings",
                },
                incomestatement: {
                    totalRevenue: "Total Revenue",
                    costOfRevenue: "Cost of Revenue",
                    grossProfit: "Gross Profit",
                    operatingExpenses: "Operating Expenses",
                    sellingGeneralAndAdministrative:
                        "Selling General & Administrative",
                    researchAndDevelopment: "Research & Development",
                    operatingIncome: "Operating Income/Loss",
                    interestExpense: "Interest Expense",
                    incomeBeforeTax: "Income before Tax",
                    incomeTaxExpense: "Income Tax Expense",
                    netIncomeFromContinuingOperations: "Net Income",
                },
            },
            viewReports: [],
            loaded: false,
            indexes: [0, 1, 2, 3],
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
                "Net Income",
            ],
            inside: ["Cash & Cash Equivalent", "Other Short-Term Investment"],
            selectedView: "annualReports",
            financial: "incomestatement"
        };
    },
    created() {
        this.loadFinancials();
    },
    methods: {
        pickedView(sView) {
            if (this.selectedView === sView) {
                this.selectedView = null;
            } else {
                this.selectedView = sView;
            }
        },
        pickedFinancials(financials) {
            if (this.financial === financials) {
                this.financial = null
            } else {
                this.financial = financials
            }
        },
        loadFinancials() {
            this.formattedDates = [];

            console.log(this.stock)

            axios
                .get(
                    `http://localhost:5000/stockprice/${this.financial}/${this.stock}`
                )
                .then((response) => {
                    console.log(response.data.annualReports);
                    const viewResponse = response.data[this.selectedView];

                    this.viewReports = viewResponse;

                    for (let i = 0; i < 4; i++) {
                        let fiscalDate = viewResponse[i].fiscalDateEnding.split("-");
                        let day = fiscalDate[2];
                        let month = fiscalDate[1];
                        let year = fiscalDate[0];
                        this.formattedDates.push(`${day}/${month}/${year}`);

                        if (this.selectedFinancials == "incomestatement") {
                            this.viewReports[i].operatingExpenses =
                                parseInt(viewResponse[i].sellingGeneralAndAdministrative) +
                                parseInt(viewResponse[i].researchAndDevelopment);
                        }
                    }

                    this.loaded = true;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
    watch: {
        selectedView: "loadFinancials",
        financial: "loadFinancials",
        stock: "loadFinancials"
    },
};
</script>

<style scoped>
h4 {
    @apply 
    text-2xl;
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
    text-navy-950;
}
</style>