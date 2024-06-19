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
      <q-btn
        outline
        color="grey-8"
        to="/hr/settings"
        label="Payroll Settings"
      />
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
        </template>
        <template #header-cell="props">
          <q-th :props="props" class="text-capitalize text-bold">
            {{ props.col.label.toUpperCase() }}
          </q-th>
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td v-for="c in columns" :key="c.name" :props="props">
              <div v-if="c.name != 'actions'">
                {{ props.row[c.name] || 0 }}
                <q-popup-edit
                  v-if="c.classes == 'editable'"
                  v-model="props.row[c.name]"
                  auto-save
                  v-slot="scope"
                  anchor="top left"
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
                        changeDetails(c.name, scope.value, props.row.profile_id)
                    "
                  />
                </q-popup-edit>
              </div>
              <div v-if="c.name == 'actions'">
                <q-btn
                  v-if="!props.row.status"
                  class="q-mr-xs"
                  dense
                  color="warning"
                  size="sm"
                  label="Approve Payroll"
                />
                <q-btn
                  v-if="props.row.status"
                  class="q-mr-xs"
                  dense
                  color="negative"
                  size="sm"
                  label="Recalculate"
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
import { hr_api } from "src/boot/axios";
import { date } from "quasar";
import { usePayrollStore } from "../../stores/payroll";
import { useConstants } from "src/stores/constants";

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

const pagination = ref({
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 10,
});

const col = ref("");
const columns = ref();

let sssTable = ref([]);

const changeDetails = async (name, row, user_id) => {
  calculatePayroll(row, name, user_id);
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

const loadPayrollPeriod = async () => {
  await getSSSTable();
  await payrollStore.fetchColumnUsed();
  columns.value = JSON.parse(payrollStore.getColumns);
  await hr_api.get("payroll/getPP").then((response) => {
    for (const c in response.data) {
      pp.push(response.data[c]);
    }
  });
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
    console.log(props.pagination);
    const offset = (page - 1) * rowsPerPage;
    const limit = rowsPerPage;
    getPayrollReport(offset, limit, page);
  } else {
    console.log(needle);
    const filteredRow = tablerows.value.filter(
      (row) => row.name.toLowerCase().indexOf(needle.toLowerCase()) > -1
    );
    tablerows.value = filteredRow;
  }
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
      calculatePayroll();
      tableLoading.value = false;
      pagination.value.page = page;
      // console.log(tablerows.value);
    });
};

const calculatePayroll = (r = null, name = null, user_id = null) => {
  console.log("calculating...");
  tablerows.value = [];
  for (let res of payrollReport) {
    let charges = {};
    let val = [];
    let deductions = 0;
    // let coopDetails = {};
    let manHours = fetchDaysWork(res.profile.user_id);
    if (payrollPeriod.value.per_week_no == 1) {
      val["sss"] = getSSSDeduction(res.gross_pay);
    } else {
      val["sss"] = 0;
    }
    val["philhealth"] = "100.00";
    val["pag_ibig"] = getPagIbigDeduction(manHours);

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
        if (name != null && field == name && res.profile.user_id == user_id) {
          charges[field] = r;
          val[field] = parseFloat(r);
        } else {
          charges[field] = val[field];
        }
        deductions += parseFloat(val[field]) || 0;
      }
    }
    charges["deductions"] = deductions.toFixed(2);
    charges["net_pay"] = constants.numberWithCommas(
      (parseFloat(res.gross_pay) - parseFloat(deductions)).toFixed(2)
    );

    tablerows.value.push(charges);
  }
  console.log(tablerows.value);
};

watch(tableTitle, async (newValue) => {
  if (newValue) {
    getPayrollReport();
  }
});
</script>

<style lang="scss" scoped>
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
