<template>
  <div>
    <header-layout mainTitle="PAYROLL" moduleTitle="Man Hours Daily">
      <q-btn outline color="grey-8" to="/dashboard" label="Dashboard" />
      <q-btn
        outline
        color="grey-8"
        to="/payroll/create"
        label="Create Payroll"
      />
      <q-btn outline label="HOURLY ENTRY" @click="addManHourDaily = true" />
    </header-layout>

    <div class="q-pa-md">
      <q-markup-table dense separator="cell" flat>
        <thead>
          <tr>
            <th style="border: none !important" colspan="3">
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
                    v.per_from +
                    ' - ' +
                    v.per_to +
                    '( week ' +
                    v.per_week_no +
                    ' )'
                "
                option-value="id"
                @update:model-value="(v) => fetchManHourDaily(v)"
                label="Payroll Period :"
                bg-color="white"
                :rules="[(val) => val || 'Please Select a Payroll Period']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </th>
            <th style="border: none !important" colspan="22"></th>
            <th style="border: none !important" colspan="3">
              <q-select
                class="q-pb-none col-8"
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                v-model="profile"
                :options="profileOptions"
                @filter="profileFn"
                :option-label="(v) => v.firstname + ' ' + v.lastname"
                :option-value="(v) => v.user_id"
                label="Search Employee"
                bg-color="white"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </th>
          </tr>
          <tr class="grossPaymentHeader">
            <td
              style="vertical-align: middle; width: 15%; text-align: center"
              rowspan="3"
              class="font-weight-bold"
            >
              Name
            </td>
            <td
              style="vertical-align: middle; width: 5%; text-align: center"
              rowspan="2"
              colspan="2"
              class="font-weight-bold"
            >
              Days of Work
            </td>
            <!-- <td style="vertical-align: middle; width:5%; text-align: center" rowspan="2" class="font-weight-bold">COLA</td> -->
            <td class="text-center font-weight-bold" colspan="6">OVERTIME</td>
            <td class="text-center font-weight-bold" colspan="6">
              OT NIGHT DIFF
            </td>
            <td class="text-center font-weight-bold" colspan="6">
              NIGHT DIFFERENTIAL
            </td>
            <td class="text-center font-weight-bold" colspan="4">HOLIDAYS</td>
            <td
              style="vertical-align: middle; width: 10%; text-align: center"
              rowspan="2"
            >
              SD Rate
            </td>

            <td
              style="
                vertical-align: middle;
                width: 10% !important;
                text-align: center;
              "
              class="font-weight-bold"
              rowspan="3"
            >
              Gross Pay
            </td>
          </tr>
          <tr>
            <td class="text-center" colspan="2">REG OT</td>
            <td class="text-center" colspan="2">SHD OT</td>
            <td class="text-center" colspan="2">RHD OT</td>
            <td class="text-center" colspan="2">REG</td>
            <td class="text-center" colspan="2">SHD</td>
            <td class="text-center" colspan="2">RHD</td>
            <td class="text-center" colspan="2">REG</td>
            <td class="text-center" colspan="2">SHD</td>
            <td class="text-center" colspan="2">RHD</td>
            <td class="text-center" colspan="2">SHD</td>
            <td class="text-center" colspan="2">RHD</td>
          </tr>
          <tr class="daysAmountHeader">
            <td class="text-center">Days</td>
            <td class="text-center">Amt</td>
            <!-- <td class="text-center">Amt</td> for cola -->
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Hrs</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Days</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Days</td>
            <td class="text-center">Amt</td>
            <td class="text-center">Amt</td>
          </tr>
        </thead>
        <tbody>
          <tr
            class="tableOver"
            v-for="mhd in manHourDailyDetails"
            :key="mhd.id"
          >
            <td>{{ mhd.profile_lastname + ", " + mhd.profile_firstname }}</td>
            <td>{{ (parseFloat(mhd.reg_hours) / 8).toFixed(1) }}</td>
            <td>{{ numberWithCommas(mhd.reg_amt) }}</td>
            <td>{{ mhd.ot_reg }}</td>
            <td>{{ mhd.ot_reg_amt }}</td>
            <td>{{ mhd.ot_sp || "0.00" }}</td>
            <td>{{ mhd.ot_sp_amt || "0.00" }}</td>
            <td>{{ mhd.ot_hd || "0.00" }}</td>
            <td>{{ mhd.ot_hd_amt || "0.00" }}</td>
            <td>{{ mhd.otnd_reg || "0.00" }}</td>
            <td>{{ mhd.otnd_reg_amt || "0.00" }}</td>
            <td>{{ mhd.otnd_sp || "0.00" }}</td>
            <td>{{ mhd.otnd_sp_amt || "0.00" }}</td>
            <td>{{ mhd.otnd_hd || "0.00" }}</td>
            <td>{{ mhd.otnd_hd_amt || "0.00" }}</td>
            <td>{{ mhd.nd_reg || "0.00" }}</td>
            <td>{{ mhd.nd_reg_amt || "0.00" }}</td>
            <td>{{ mhd.nd_sp || "0.00" }}</td>
            <td>{{ mhd.nd_sp_amt || "0.00" }}</td>
            <td>{{ mhd.nd_hd || "0.00" }}</td>
            <td>{{ mhd.nd_hd_amt || "0.00" }}</td>
            <td>{{ mhd.hd_sp || "0.00" }}</td>
            <td>{{ mhd.hd_sp_amt || "0.00" }}</td>
            <td>{{ mhd.hd_reg || "0.00" }}</td>
            <td>{{ mhd.hd_reg_amt || "0.00" }}</td>
            <td>{{ mhd.sd_amt || "0.00" }}</td>
            <td>
              {{
                getGrossPay(
                  parseFloat(mhd.reg_amt || 0) +
                    parseFloat(mhd.ot_reg_amt || 0) +
                    parseFloat(mhd.ot_sp_amt || 0) +
                    parseFloat(mhd.ot_hd_amt || 0) +
                    parseFloat(mhd.otnd_reg_amt || 0) +
                    parseFloat(mhd.otnd_sp_amt || 0) +
                    parseFloat(mhd.otnd_hd_amt || 0) +
                    parseFloat(mhd.nd_reg_amt || 0) +
                    parseFloat(mhd.nd_sp_amt || 0) +
                    parseFloat(mhd.nd_hd_amt || 0) +
                    parseFloat(mhd.hd_sp_amt || 0) +
                    parseFloat(mhd.hd_reg_amt || 0) +
                    parseFloat(mhd.sd_amt || 0),
                  mhd.pdh_emp_id
                )
              }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <q-dialog v-model="addManHourDaily" persistent>
      <q-card
        class="my-card q-pa-none"
        flat
        style="width: 970px; max-width: 80vw"
      >
        <q-bar>
          <q-icon name="add" />
          <div>Payroll Daily Entry</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <HourlyEntryForm :payrollPeriod="selectedPayrollPeriod" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { hr_api } from "../../boot/axios";
import HourlyEntryForm from "../../components/payroll/HourlyEntryForm.vue";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import { useRoute, useRouter } from "vue-router";

const payrollPeriod = ref();
const selectedPayrollPeriod = ref();
const pp = [];
const ppOptions = ref(pp);
const manHourDailyDetails = ref();
const grossPayPerEmployee = [];

const addManHourDaily = ref(false);
const route = useRoute();
const router = useRouter();

const payrollPeriodFn = async (val, update, abort) => {
  if (pp.length == 0) {
    await hr_api.get("payroll/getPP").then((response) => {
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

const getGrossPay = (details, emp_id) => {
  const payReportDetails = {
    profile: emp_id,
    payrollPeriod: selectedPayrollPeriod.value.per_id,
    gross_pay: details.toFixed(2),
  };
  grossPayPerEmployee.push(payReportDetails);
  return numberWithCommas(details.toFixed(2));
};

const fetchManHourDaily = async (v) => {
  selectedPayrollPeriod.value = v;
  router.push("/payroll/man-hours/" + v.per_id);
  await hr_api.get("payroll/man-hours/all/" + v.per_id).then((response) => {
    manHourDailyDetails.value = response.data;
  });
  console.log(grossPayPerEmployee);

  await hr_api
    .post("payroll/save-to-report", grossPayPerEmployee)
    .then((response) => {
      console.log(response);
    });
};
const loadPage = async () => {
  await hr_api.get("payroll/getPP").then((response) => {
    for (const c in response.data) {
      pp.push(response.data[c]);
    }
  });

  if (route.params["payrollPeriod"]) {
    console.log(route.params["payrollPeriod"]);
    selectedPayrollPeriod.value = pp.filter(
      (v) => v.per_id == route.params["payrollPeriod"]
    )[0];
    payrollPeriod.value = selectedPayrollPeriod.value;
    fetchManHourDaily(payrollPeriod.value);
  }
};

loadPage();

const numberWithCommas = (x) => {
  if (x == null) {
    x = 0;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<style lang="scss" scoped>
td,
th {
  border: 1px solid grey !important;
  text-align: center;
}
td.text-left {
  text-align: left;
}
tr.tableOver:hover {
  background-color: aquamarine;
}
</style>
