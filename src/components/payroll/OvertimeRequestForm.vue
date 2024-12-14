<template>
  <q-card class="my-card" style="width: 400px">
    <q-bar dark class="bg-primary text-white">
      <div class="col text-left text-weight-bold">
        Overtime Request for {{ otDetails.name }}
      </div>
      <q-space />
      <q-btn
        dense
        flat
        round
        @click="$emit('close')"
        icon="close"
        size="8.5px"
        color="white"
      />
    </q-bar>
    <q-card-section class="row">
      <div class="col-12 row">
        <q-input
          class="text-md col-lg-8"
          dense
          v-model="otForm.ot_date"
          mask="date"
          label="OT Date : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="otForm.ot_date"> </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-space />
        <q-input
          v-model="otForm.no_hours"
          dense
          type="text"
          label="No of Hours"
          class="col-lg-3"
        />
      </div>
      <div class="col-12 row q-py-md">
        <q-input
          autogrow
          filled
          class="col-lg-12"
          v-model="otForm.ot_purpose"
          type="textarea"
          label="Purpose of OT"
        />
      </div>
      <div class="col-12">
        <q-select
          class="q-pb-none col-lg-md"
          dense
          v-model="otForm.payrollPeriod"
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
      </div>
    </q-card-section>
    <q-card-actions class="q-py-lg" align="right">
      <q-btn @click="submitOTRequest" color="primary" label="Submit" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { date, LocalStorage, useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const ppOptions = ref([]);
const user = LocalStorage.getItem("user");
const $q = useQuasar();

const emit = defineEmits(["close"]);
const props = defineProps({
  otDetails: {},
});

const otForm = ref({
  employee: props.otDetails.employee.profile.user_id,
  requested_by: user.id,
  ot_date: date.formatDate(props.otDetails.date, "YYYY-MM-DD"),
  no_hours: 0,
  ot_purpose: "",
  date_requested: date.formatDate(Date.now(), "YYYY-MM-DD HH:mm:ss"),
  payrollPeriod: null,
  status: false,
});

console.log("otDetails : ", props.otDetails.employee.profile.user_id);

const submitOTRequest = async () => {
  await hr_api.post("payroll/otRequest", otForm.value).then((response) => {
    console.log(response.data);
    emit("close");
    $q.notify({
      color: "positive",
      position: "top",
      message: "OT Request Successfully Submitted",
      icon: "check",
    });
  });
};

const getPayrollPeriod = async () => {
  await hr_api.get("payroll/getPP").then((response) => {
    for (const c in response.data) {
      ppOptions.value.push(response.data[c]);
    }
  });
};

getPayrollPeriod();
</script>

<style lang="scss" scoped></style>
