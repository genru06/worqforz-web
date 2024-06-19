<template>
  <q-card>
    <q-bar dark class="bg-primary text-white">
      <div class="col text-center text-weight-bold">
        {{ $props.details.name }}
      </div>
      <q-btn
        v-close-popup
        dense
        round
        icon="close"
        size="8.5px"
        color="red"
      ></q-btn>
    </q-bar>
    <q-card-section>
      <q-markup-table dense separator="cell" flat>
        <thead>
          <tr>
            <td style="border: none !important; font-weight: bold"></td>
          </tr>
          <tr>
            <td rowspan="2">DATE</td>
            <td rowspan="2">HRS</td>
            <td class="text-center font-weight-bold" colspan="3">OVERTIME</td>
            <td class="text-center font-weight-bold" colspan="3">
              OT NIGHT DIFF
            </td>
            <td class="text-center font-weight-bold" colspan="3">
              NIGHT DIFFERENTIAL
            </td>
            <td class="text-center font-weight-bold" colspan="2">HOLIDAYS</td>
            <td
              style="vertical-align: middle; width: 10%; text-align: center"
              rowspan="2"
            >
              SD Rate
            </td>
          </tr>
          <tr>
            <td class="text-center">REG OT</td>
            <td class="text-center">SHD OT</td>
            <td class="text-center">RHD OT</td>
            <td class="text-center">REG</td>
            <td class="text-center">SHD</td>
            <td class="text-center">RHD</td>
            <td class="text-center">REG</td>
            <td class="text-center">SHD</td>
            <td class="text-center">RHD</td>
            <td class="text-center">SHD</td>
            <td class="text-center">RHD</td>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="$emit('loadAttendance', [mh.pdh_date])"
            v-for="mh in manHours"
            :key="mh.id"
            class="tableOver"
          >
            <td>{{ mh.pdh_date }}</td>
            <td>{{ mh.pdh_hours }}</td>
            <td>{{ mh.pdh_ot_reg || "<b>0.00</b>" }}</td>
            <td>{{ mh.pdh_ot_sp || "0.00" }}</td>
            <td>{{ mh.pdh_ot_hd || "0.00" }}</td>
            <td>{{ mh.pdh_otnd_reg || "0.00" }}</td>
            <td>{{ mh.pdh_otnd_sp || "0.00" }}</td>
            <td>{{ mh.pdh_otnd_hd || "0.00" }}</td>
            <td>{{ mh.pdh_nd_reg || "0.00" }}</td>
            <td>{{ mh.pdh_nd_sp || "0.00" }}</td>
            <td>{{ mh.pdh_nd_hd || "0.00" }}</td>
            <td>{{ mh.hd_reg || "0.00" }}</td>
            <td>{{ mh.hd_sp || "0.00" }}</td>
            <td>{{ mh.pdh_sd || "0.00" }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { ref } from "vue";
import { hr_api } from "../../boot/axios";

const manHours = ref();
const emit = defineEmits(["loadAttendance"]);
const props = defineProps({
  details: {},
  att_date: date.formatDate(Date.now(), "YYYY-MM-DD"),
});

const fetchDTR = () => {
  hr_api
    .get(
      "payroll/man-hours/perPeriodByDate/" +
        props.details.employee.profile.user_id +
        "/" +
        date.formatDate(props.att_date, "YYYY-MM-DD") +
        "/" +
        props.details.employee.workplace.id
    )
    .then((response) => {
      console.log(response.data);
      manHours.value = response.data;
    });
};
fetchDTR();
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
  cursor: pointer;
  background-color: aquamarine;
}
</style>
