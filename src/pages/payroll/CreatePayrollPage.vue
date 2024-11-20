<template>
  <div>
    <header-layout mainTitle="PAYROLL" moduleTitle="Create Payroll">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn
        outline
        color="grey-8"
        @click="setPayroll = true"
        label="Set Payroll Period"
      />
      <q-btn
        outline
        color="grey-8"
        to="/payroll/man-hours"
        label="View Man hours"
      />
      <q-btn outline color="grey-8" to="/settings" label="Payroll Settings" />
    </header-layout>

    <div class="q-pa-md">
      <q-table
        :title="tableTitle"
        :rows="tablerows"
        :columns="columns"
        row-key="profile_id"
        separator="horizontal"
        :filter="filter"
        :loading="tableLoading"
        v-model:pagination="pagination"
        @request="getPayrollPerPage"
      >
        <template v-slot:top-right="props">
          <q-input
            outlined
            dense
            debounce="0"
            v-model="filter"
            placeholder="Search here..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            class="q-pb-none col-lg-md"
            outlined
            dense
            v-model="payrollPeriod"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="ppOptions"
            @filter="payrollPeriodFn"
            :option-label="
              (v) =>
                v.per_from + ' - ' + v.per_to + '( week ' + v.per_week_no + ' )'
            "
            option-value="id"
            @update:model-value="(v) => setTableTitle(v)"
            label="Payroll Period :"
            bg-color="white"
            :rules="[(val) => val || 'Please Select a Payroll Period']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          >
            <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
              >{{
                props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
              }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            color="primary"
            icon="summarize"
            @click="generatePayrollReport()"
          >
            <q-tooltip> Generate Payroll Report </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            color="primary"
            icon="account_balance"
            @click="generateBankTransmital()"
          >
            <q-tooltip> Generate Bank Transmittal </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            color="primary"
            icon="receipt_long"
            @click="generatePayslip()"
          >
            <q-tooltip> Generate Payslip </q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            color="primary"
            icon="payments"
            @click="generateBillingReport()"
          >
            <q-tooltip> Generate Billing Report </q-tooltip>
          </q-btn>
        </template>
        <template #header-cell="props">
          <q-th :props="props" class="text-capitalize text-bold">
            {{ props.col.label.toUpperCase() }}
          </q-th>
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td
              v-for="c in columns"
              :key="c.name"
              :props="props"
              :class="getColumnClass(c)"
            >
              <div v-if="c.name != 'actions'">
                <span v-if="c.classes != 'editable'">{{
                  props.row[c.name] || 0
                }}</span>
                <q-input
                  v-if="c.classes == 'editable'"
                  v-model="props.row[c.name]"
                  dense
                  borderless
                  autofocus
                  @keyup.enter="
                    changeDetails(
                      c.name,
                      props.row[c.name],
                      props.row.profile_id,
                      props.row.id
                    )
                  "
                />
                <!-- <q-popup-edit
                  v-if="c.classes == 'editable'"
                  v-model="props.row[c.name]"
                  :ref="props.row[c.name]"
                  auto-save
                  v-slot="scope"
                  anchor="top left"
                  @save="
                    changeDetails(
                      c.name,
                      scope.value,
                      props.row.profile_id,
                      props.row[c.name]
                    )
                  "
                >
                  <div class="text-italic text-primary">
                    {{ c.label }}
                  </div>
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    @keyup.enter="
                      scope.set,
                        changeDetails(
                          c.name,
                          scope.value,
                          props.row.profile_id,
                          props.row[c.name]
                        )
                    "
                  />
                </q-popup-edit> -->
              </div>
              <div v-if="c.name == 'actions'">
                <q-btn
                  v-if="!props.row.status"
                  class="q-mr-xs"
                  dense
                  color="warning"
                  size="sm"
                  label="Approve Payroll"
                  @click="approvePayroll(props.row, props.cols)"
                />
                <q-btn
                  v-if="props.row.status"
                  class="q-mr-xs"
                  dense
                  color="negative"
                  size="sm"
                  label="Recalculate"
                  @click="recalculatePayroll(props.row)"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>

    <q-dialog v-model="setPayroll" persistent>
      <SetPayrollForm />
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import SetPayrollForm from "../../components/payroll/SetPayrollForm.vue";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import { coop_api, hr_api } from "src/boot/axios";
import { LocalStorage, date } from "quasar";
import { usePayrollStore } from "../../stores/payroll";
import { useConstants } from "src/stores/constants";
import { useRoute, useRouter } from "vue-router";

const payrollStore = usePayrollStore();
const constants = useConstants();
const setPayroll = ref(false);
const payrollPeriod = ref();
const pp = [];
const ppOptions = ref(pp);
const tableTitle = ref("");
const tablerows = ref([]);
const tableLoading = ref(false);
const filter = ref("");
const cellInput = ref([]);
const charges = ref([]);
const manHours = ref([]);
const coopDeduction = ref([]);
let payrollReport = [];
const user = LocalStorage.getItem("user");

const route = useRoute();
const router = useRouter();

const pagination = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 10,
});

const col = ref("");
const columns = ref();

let sssTable = ref([]);

const changeDetails = async (name, row, user_id, rowid) => {
  console.log("rowValue : ", row, rowid);
  calculatePayroll(row, name, user_id, tablerows.value[rowid][name], rowid);
};

const setTableTitle = async (details) => {
  tableTitle.value =
    "Period Covered : " +
    date.formatDate(details.per_from, "MMMM DD, YYYY") +
    " - " +
    date.formatDate(details.per_to, "MMMM DD, YYYY");
};

const payrollPeriodFn = async (val, update, abort) => {
  if (pp.length == 0) {
    hr_api.get("payroll/getPP").then((response) => {
      for (const c in response.data) {
        pp.push(response.data[c]);
      }
    });
  }

  update(() => {
    const needle = val.toLowerCase();
    ppOptions.value = pp.filter(
      (v) => v.per_from.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getColumnClass = (col) => {
  if (col.name.toLowerCase() === "name") {
    return "frozen-column first";
  } else if (col.name.toLowerCase() === "position") {
    return "frozen-column second";
  } else if (col.name === "gross_pay") {
    return "frozen-column third";
  }
  return "";
};

const loadPayrollPeriod = async () => {
  await getSSSTable();
  await payrollStore.fetchColumnUsed();
  columns.value = JSON.parse(payrollStore.getColumns);
  console.log(columns.value);
  await hr_api.get("payroll/getPP").then((response) => {
    for (const c in response.data) {
      pp.push(response.data[c]);
    }
  });

  if (route.params["payrollPeriod"]) {
    payrollPeriod.value = pp.filter(
      (v) => v.per_id == route.params["payrollPeriod"]
    )[0];
    setTableTitle(payrollPeriod.value);
  }
};

const getSSSTable = async () => {
  await hr_api.get("payroll/sssTable").then((response) => {
    sssTable.value = response.data;
  });
};

const getManHours = async () => {
  await hr_api
    .get("payroll/man-hours/all/" + payrollPeriod.value.per_id)
    .then((response) => {
      manHours.value = response.data;
    });
};

const fetchDaysWork = (user_id) => {
  let mh = manHours.value.filter((v) => v.pdh_emp_id == user_id)[0];
  let regHours = mh.reg_hours;
  const daysWork = regHours / 8;

  return daysWork;
};

const getSSSDeduction = (grossPay) => {
  let weekNo = payrollPeriod.value.per_week_no;
  let lastweek = payrollPeriod.value.per_from;
  let sss;

  for (const table of sssTable.value) {
    if (grossPay >= table.ssst_from && grossPay <= table.ssst_to) {
      sss = table.ssst_ee;
    }
  }

  return sss;
};

const getPagIbigDeduction = (days) => {
  let details = columns.value.filter((v) => v.name == "pag_ibig")[0];
  let daysWork = parseFloat(days);
  console.log("pagibig", details.formula);
  try {
    return constants.evaluateExpression(details.formula, {
      daysWork: daysWork,
    });
  } catch (e) {
    console.error("Error evaluating expression:", e);
    return null;
  }
  // return deduction;
};

loadPayrollPeriod();

const getPayrollPerPage = async (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  const needle = props.filter;
  if (needle == "") {
    const offset = (page - 1) * rowsPerPage;
    const limit = rowsPerPage;
    router.push(
      "/payroll/create/" +
        payrollPeriod.value.per_id +
        `/${page}/${offset}/${limit}`
    );
    getPayrollReport(offset, limit, page);
  } else {
    console.log(needle);
    const filteredRow = tablerows.value.filter(
      (row) => row.name.toLowerCase().indexOf(needle.toLowerCase()) > -1
    );
    tablerows.value = filteredRow;
  }
};

const approvePayroll = async (row, col) => {
  console.log(row, col);
  const payrollDetails = {};
  const { coopDeduction, ...rowDetails } = row;
  for (const r in rowDetails) {
    if (r != "name" && r != "position" && row[r] != undefined) {
      const value = isNaN(row[r])
        ? parseFloat(row[r].replace(/,/g, ""))
        : row[r];
      payrollDetails[r] = value;
    }
  }
  payrollDetails.payrollPeriod = payrollPeriod.value.per_id;
  payrollDetails.coopDeduction = coopDeduction;
  console.log(payrollDetails);

  await hr_api.post("payroll/approved", payrollDetails).then((response) => {
    tablerows.value[row.id].status = true;
  });
};

const recalculatePayroll = async (row) => {
  const details = {
    profile: row.profile_id,
    payrollPeriod: payrollPeriod.value.per_id,
    status: false,
    details: JSON.stringify({}),
  };

  await hr_api.post("payroll/recalculate", details).then((response) => {
    tablerows.value[row.id].status = false;
  });
};

const getPayrollReport = async (offset = 0, limit = 15, page = 1) => {
  tableLoading.value = true;
  tablerows.value = [];
  if (page == 1) {
    await getManHours();
  }

  await hr_api
    .get(
      "payroll/report/" +
        payrollPeriod.value.per_id +
        "/" +
        offset +
        "/" +
        limit
    )
    .then(async (response) => {
      pagination.value.rowsNumber = response.data.count;
      payrollReport = response.data.data;
      pagination.value.page = page;
      calculatePayroll();
      // console.log(tablerows.value);
    });
};

const calculatePayroll = async (
  r = null,
  name = null,
  user_id = null,
  value = null,
  rowid = null
) => {
  console.log("calculating...", r, user_id);

  tableLoading.value = true;
  if (!r) {
    tablerows.value = [];
    let count = 0;
    for (let res of payrollReport) {
      let charges = {};
      charges["status"] = res.status;
      charges["id"] = count;

      count++;
      if (count <= 15) {
        let val = [];
        let deductions = 0;
        if (!res.status) {
          let statBen = await getStatBen(
            res.payrollPeriod.per_id,
            res.profile.user_id,
            res.profile.employee.workplace.id,
            res.gross_pay,
            res.profile.employee.salary
          );
          let coopDeduction = await fetchCoopDeduction(
            res.profile.user_id,
            res.payrollPeriod.per_to
          );
          charges["coopDeduction"] = coopDeduction.data;
          if (coopDeduction.data) {
            const loanBalances = coopDeduction.data.balances;
            if (coopDeduction.data.shareCapital.deposits < 5000) {
              val["share_capital"] = 100;
            }

            for (const lb of loanBalances) {
              if (lb.status == 2) {
                val[lb.loanName] = lb.balanceDue;
              }
            }
          }
          val["sss"] = statBen.data.sss;
          val["philhealth"] = statBen.data.ph.toFixed(2);
          val["pag_ibig"] = statBen.data.pagIbig.toFixed(2);
        }

        charges["profile_id"] = res.profile.user_id;
        charges["name"] = res.profile.lastname + ", " + res.profile.firstname;
        charges["position"] = res.profile.employee
          ? res.profile.employee.position.position
          : "";
        charges["gross_pay"] = constants.numberWithCommas(res.gross_pay);

        for (let c of columns.value) {
          let field = c.field;
          if (
            field != "name" &&
            field != "position" &&
            field != "gross_pay" &&
            field != "net_pay" &&
            field != "deductions"
          ) {
            if (
              name != null &&
              field == name &&
              res.profile.user_id == user_id
            ) {
              charges[field] = r;
              val[field] = isNaN(r) ? "0.00" : parseFloat(r).toFixed(2);
            } else {
              charges[field] = isNaN(val[field])
                ? "0.00"
                : parseFloat(val[field]).toFixed(2);
            }
            deductions += parseFloat(val[field]) || 0;
          }
        }
        if (charges["share_capital"] != 0 && !res.status) {
          charges["coopDeduction"]["share_capital"] = charges["share_capital"];
        }
        charges["deductions"] = constants.numberWithCommas(
          deductions.toFixed(2)
        );
        charges["net_pay"] = constants.numberWithCommas(
          (parseFloat(res.gross_pay) - parseFloat(deductions)).toFixed(2)
        );

        if (res.status) {
          for (const d in res.details) {
            charges[d] = res.details[d];
            charges["status"] = res.status;
          }
        }
        charges["teller"] = user.id;

        tablerows.value.push(charges);
      }
    }

    tableLoading.value = false;
  } else {
    console.log("PR : ", payrollReport);
    const rowDetails = payrollReport.filter(
      (v) => v.profile.user_id == user_id
    )[0];
    console.log("name :", name);

    if (!rowDetails.status) {
      const rows = tablerows.value;
      const row = rows[rowid];
      let deductions = 0;
      for (const rw in row) {
        // console.log(rw, row[rw]);
        let field = rw;
        if (
          field != "name" &&
          field != "position" &&
          field != "gross_pay" &&
          field != "net_pay" &&
          field != "coopDeduction" &&
          field != "id" &&
          field != "profile_id" &&
          field != "status" &&
          field != "teller" &&
          field != "deductions"
        ) {
          deductions += parseFloat(row[rw]);
        }
      }
      tablerows.value[rowid][name] = constants.numberWithCommas(
        parseFloat(value).toFixed(2)
      );
      tablerows.value[rowid].deductions = constants.numberWithCommas(
        deductions.toFixed(2)
      );
      tablerows.value[rowid].net_pay = constants.numberWithCommas(
        (parseFloat(rowDetails.gross_pay) - deductions).toFixed(2)
      );
      console.log("deductions : ", deductions);
      console.log("netPay : ", tablerows.value[rowid].net_pay);
    }
  }
  tableLoading.value = false;
  console.log(tablerows.value);
};

const fetchCoopDeduction = async (id, date_to) => {
  return await coop_api
    .get("coop/loans/balances/individual/" + id + "/" + date_to)
    .then();
};

const getStatBen = async (
  pp_id,
  profile_id,
  workplace,
  grossPay,
  monthlyPay
) => {
  return await hr_api
    .get(
      "payroll/statBen/" +
        pp_id +
        "/" +
        profile_id +
        "/" +
        workplace +
        "/" +
        grossPay +
        "/" +
        monthlyPay
    )
    .then();
};

const generateBillingReport = () => {
  const url =
    process.env.HR_API_URL +
    "payroll/generate/billing/report/" +
    payrollPeriod.value.per_id +
    "/1";
  console.log(url);

  window.open(url, "_blank");
};

const generatePayrollReport = () => {
  const url =
    process.env.HR_API_URL +
    "payroll/report/generate/" +
    payrollPeriod.value.per_id;
  console.log(url);

  window.open(url, "_blank");
};

const generateBankTransmital = () => {
  const url =
    process.env.HR_API_URL +
    "payroll/generate/bank_transmital/" +
    payrollPeriod.value.per_id;
  console.log(url);

  window.open(url, "_blank");
};

const generatePayslip = () => {
  const url =
    process.env.HR_API_URL +
    "payroll/generate/payslip/" +
    payrollPeriod.value.per_id +
    "/" +
    route.params["offset"] +
    "/" +
    route.params["limit"] +
    route.params["page"] +
    "/" +
    payrollPeriod.value.workplace.id;

  console.log(url);
  window.open(url, "_blank");
};

watch(tableTitle, async (newValue) => {
  if (newValue) {
    if (route.params["payrollPeriod"]) {
      console.log("has already ");

      getPayrollReport(
        route.params["offset"],
        route.params["limit"],
        route.params["page"]
      );
    } else {
      router.push("/payroll/create/" + payrollPeriod.value.per_id + "/1/0/15/");
      getPayrollReport(0, 15, 1);
    }
  }
});
</script>

<style lang="scss" scoped>
.frozen-column {
  position: sticky;
  background: white;
  z-index: 1;
}

.frozen-column.first {
  left: 0;
  z-index: 3; /* Ensure this column is on top of the other frozen columns */
  width: 160px;
}

.frozen-column.second {
  left: 160px; /* Adjust this based on the width of the first column */
  z-index: 2; /* Ensure this column is below the first frozen column */
}

.frozen-column.third {
  left: 320px; /* Adjust this based on the width of the first two columns */
  z-index: 1; /* Ensure this column is below the first two frozen columns */
  box-shadow: 2px 0 5px -2px #888;
}

.q-table__rows-container {
  display: flex;
}

.q-table__row {
  display: flex;
}

.q-th.frozen-column.first {
  left: 0;
}

.q-th.frozen-column.second {
  left: 160px; /* Adjust this based on the width of the first column */
}

.q-th.frozen-column.third {
  left: 330px; /* Adjust this based on the width of the first two columns */
}

.q-field__control {
  border-bottom: 2px solid black !important;
}
@media (min-width: 600px) {
  .q-dialog__inner--minimized > div {
    max-width: 980px;
  }
}

.formDialog {
  width: 980px !important;
}
</style>
