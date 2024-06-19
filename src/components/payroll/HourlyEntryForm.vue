<template>
  <q-card class="my-card" flat>
    <q-card-section class="row justify-end q-pa-sm">
      <q-select
        class="q-pa-none col-4"
        dense
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        v-model="form.profile"
        :options="profileOptions"
        @filter="profileFn"
        :option-label="
          (v) => v.lastname + ', ' + v.firstname + ' ' + v.middlename
        "
        :option-value="(v) => v.user_id"
        label="Search Employee"
        bg-color="white"
        @update:model-value="(v) => setManHourDailyEntries(v)"
        :rules="[(val) => val || 'Please select an Employee']"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
    <q-separator spaced />
    <q-card-section class="row q-gutter-sm q-pa-none">
      <q-select
        v-model="dailyHours.pdh_day_id"
        :options="weekDays"
        :option-value="(v) => v.value"
        use-input
        hide-selected
        fill-input
        label="Days of Week"
        flat
        dense
        class="col"
        @update:model-value="checkIfHoliday(), getManHoursDaily()"
      />
      <q-input
        v-model="manhours"
        dense
        type="text"
        label="Hours work"
        class="col"
      />
      <q-input
        v-model="dailyHours.pdh_hours_amt"
        dense
        type="text"
        filled
        disable
        label="Amount"
        class="col"
      />
      <q-input
        v-model="dailyHours.pdh_sd_amt"
        dense
        type="text"
        label="SD Rate"
        class="col"
        filled
        disable
      />
      <q-select
        v-model="restDay"
        :options="restDayOption"
        :option-value="(v) => v.value"
        use-input
        hide-selected
        fill-input
        label="REST DAY"
        flat
        dense
        class="col"
      />
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-bar dark class="bg-blue-4">
        <div class="col text-center">OVERTIME</div>
      </q-bar>
      <div class="row q-gutter-sm">
        <q-input
          v-model="dailyHours.pdh_ot_reg"
          dense
          type="text"
          label="REGULAR"
          class="col"
          @update:model-value="calculateManHours('pdh_ot_reg', 'ot_reg_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_ot_reg_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_ot_sp"
          dense
          type="text"
          label="SPECIAL HD"
          class="col"
          @update:model-value="calculateManHours('pdh_ot_sp', 'ot_sp_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_ot_sp_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_ot_hd"
          dense
          type="text"
          label="REGULAR HD"
          class="col"
          @update:model-value="calculateManHours('pdh_ot_hd', 'ot_hd_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_ot_hd_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-bar dark class="bg-grey-4">
        <div class="col text-center">OVERTIME NIGHT DIFFERENTIAL</div>
      </q-bar>
      <div class="row q-gutter-sm">
        <q-input
          v-model="dailyHours.pdh_otnd_reg"
          dense
          type="text"
          label="REGULAR"
          class="col"
          @update:model-value="
            calculateManHours('pdh_otnd_reg', 'otnd_reg_hrs')
          "
        />
        <q-input
          v-model="dailyHours.pdh_otnd_reg_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_otnd_sp"
          dense
          type="text"
          label="SPECIAL HD"
          class="col"
          @update:model-value="calculateManHours('pdh_otnd_sp', 'otnd_sp_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_otnd_sp_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_otnd_hd"
          dense
          type="text"
          label="REGULAR HD"
          class="col"
          @update:model-value="calculateManHours('pdh_otnd_hd', 'otnd_hd_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_otnd_hd_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-bar dark class="bg-red-4 text-white">
        <div class="col text-center">NIGHT PREMIUM</div>
      </q-bar>
      <div class="row q-gutter-sm">
        <q-input
          v-model="dailyHours.pdh_nd_reg"
          dense
          type="text"
          label="REGULAR"
          class="col"
          @update:model-value="calculateManHours('pdh_nd_reg', 'nd_reg_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_nd_reg_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_nd_sp"
          dense
          type="text"
          label="SPECIAL HD"
          class="col"
          @update:model-value="calculateManHours('pdh_nd_sp', 'nd_sp_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_nd_sp_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_nd_hd"
          dense
          type="text"
          label="REGULAR HD"
          class="col"
          @update:model-value="calculateManHours('pdh_nd_hd', 'nd_hd_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_nd_hd_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-bar dark class="bg-yellow-8">
        <div class="col text-center">HOLIDAY</div>
      </q-bar>
      <div class="row q-gutter-sm">
        <q-input
          v-model="dailyHours.pdh_hd_reg"
          dense
          type="text"
          label="REGULAR"
          class="col"
          @update:model-value="calculateManHours('pdh_hd_reg', 'hd_reg_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_hd_reg_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="dailyHours.pdh_hd_sp"
          dense
          type="text"
          label="SPECIAL HD"
          class="col"
          @update:model-value="calculateManHours('pdh_hd_sp', 'hd_sp_hrs')"
        />
        <q-input
          v-model="dailyHours.pdh_hd_sp_amt"
          dense
          type="text"
          label="AMOUNT"
          class="col"
          filled
          disable
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <q-bar dark class="bg-positive text-white">
        <div class="col text-center">WEEKLY TOTAL</div>
      </q-bar>
      <div class="row q-gutter-sm">
        <q-input
          v-model="daysWork"
          dense
          type="text"
          label="DAYS WORK"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="totalOT"
          dense
          type="text"
          label="TOTAL OT"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="totalND"
          dense
          type="text"
          label="TOTAL ND"
          class="col"
          filled
          disable
        />
        <q-input
          v-model="totalHD"
          dense
          type="text"
          label="TOTAL HD"
          class="col"
          filled
          disable
        />
      </div>
    </q-card-section>
    <q-separator spaced />
    <q-card-actions align="right">
      <q-btn color="negative" dense label="Cancel" />
      <q-btn color="positive" @click="submitDailyHours" dense label="Save" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { hr_api } from "../../boot/axios";
import { useQuasar } from "quasar";

const props = defineProps({
  payrollPeriod: {},
});

const $q = useQuasar();
let holiday = {};
let isHoliday = false;
const profile = [];
const profileOptions = ref(profile);
const form = ref({
  profile: {
    name: "",
    firstname: "",
    lastname: "",
    middlename: "",
  },
});
const restDay = ref();
const restDayOption = ref([
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]);

const weekDays = ref([]);
let manHourType = [];

let dailyHours = ref({
  pdh_hours: 0,
  pdh_hours_amt: 0,
  pdh_day_id: 0,
  pdh_sd_amt: 0,
  pdh_ot_reg: 0,
  pdh_ot_reg_amt: 0,
  pdh_ot_sp: 0,
  pdh_ot_sp_amt: 0,
  pdh_ot_hd: 0,
  pdh_ot_hd_amt: 0,
  pdh_otnd_reg: 0,
  pdh_otnd_reg_amt: 0,
  pdh_otnd_sp: 0,
  pdh_otnd_sp_amt: 0,
  pdh_otnd_hd: 0,
  pdh_otnd_hd_amt: 0,
  pdh_nd_reg: 0,
  pdh_nd_reg_amt: 0,
  pdh_nd_sp: 0,
  pdh_nd_sp_amt: 0,
  pdh_nd_hd: 0,
  pdh_nd_hd_amt: 0,
  pdh_hd_reg: 0,
  pdh_hd_reg_amt: 0,
  pdh_hd_sp: 0,
  pdh_hd_sp_amt: 0,
});

const daysWork = ref(0);
const totalOT = ref(0);
const totalND = ref(0);
const totalHD = ref(0);

const fetchWeekDays = () => {
  var dayFrom = new Date(props.payrollPeriod.per_from);
  var dayTo = new Date(props.payrollPeriod.per_to);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (var day = dayFrom; day <= dayTo; day.setDate(day.getDate() + 1)) {
    var dateString =
      days[day.getDay()] +
      " " +
      String(day.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(day.getDate()).padStart(2, "0") +
      "/" +
      day.getFullYear();

    weekDays.value.push({
      value: day.getDay(),
      label: dateString,
      date:
        day.getFullYear() +
        "-" +
        String(day.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(day.getDate()).padStart(2, "0"),
    });
  }
};
fetchWeekDays();

const profileFn = async (val, update, abort) => {
  if (profile.length == 0) {
    await hr_api.get("profile/all/1").then((response) => {
      for (const c of response.data) {
        profile.push({
          user_id: c.user_id,
          name: c.lastname + " " + c.firstname,
          lastname: c.lastname,
          firstname: c.firstname,
          middlename: c.middlename,
          salary: c.employee.salary,
          restDay: c.employee.rest_day,
        });
      }
    });
  }
  update(() => {
    const needle = val.toLowerCase();
    profileOptions.value = profile.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const setManHourDailyEntries = async (profile) => {
  restDay.value = restDayOption.value.filter(
    (v) => v.value == profile.restDay
  )[0];
  console.log(restDay.value);
};

const getManHourType = async () => {
  if (manHourType.length == 0) {
    hr_api.get("payroll/man-hour-type").then((response) => {
      manHourType = getManHourFormula(response.data);
    });
  }
};

const getManHourFormula = (manHourType) => {
  let manHourTypes = {};
  for (const mht of manHourType) {
    manHourTypes[mht.pmt_col_hrs] = {
      type_id: mht.pmt_id,
      type: mht.pmt_type,
      formula: mht.pmt_calc_formula,
    };
  }
  return manHourTypes;
};

getManHourType();

const checkIfHoliday = async () => {
  const selectedDate = weekDays.value.filter(
    (v) => v.value == dailyHours.value.pdh_day_id.value
  )[0];
  console.log(selectedDate.date);

  await hr_api
    .get("calendar/is-holiday/" + selectedDate.date)
    .then((response) => {
      if (response.data) {
        holiday = response.data;
        isHoliday = true;
      }
    });
};

const calculateManHours = (type, col) => {
  const hours = parseFloat(dailyHours.value[type]);
  const basic = parseFloat(form.value.profile.salary);
  console.log(hours, basic);
  console.log(col, manHourType[col].formula, dailyHours.value[type]);
  dailyHours.value[type + "_amt"] = isNaN(eval(manHourType[col].formula))
    ? 0
    : eval(manHourType[col].formula).toFixed(2);
};

const getManHoursDaily = async () => {
  await hr_api
    .get(
      "payroll/man-hours/perPeriodByDate/" +
        form.value.profile.user_id +
        "/" +
        dailyHours.value.pdh_day_id.date +
        "/" +
        props.payrollPeriod.workplace.id +
        "/" +
        props.payrollPeriod.per_id
    )
    .then((response) => {
      const selectedDate = response.data.filter(
        (v) => v.pdh_date == dailyHours.value.pdh_day_id.date
      )[0];

      if (selectedDate) {
        dailyHours.value = selectedDate;
        manhours.value = selectedDate.pdh_hours;
        dailyHours.value.pdh_day_id = {
          value: selectedDate.pdh_day_id,
          label: weekDays.value.filter(
            (v) => v.value == selectedDate.pdh_day_id
          )[0].label,
          date: selectedDate.pdh_date,
        };
        getWeeklyTotal(response.data);
      } else {
        const d = weekDays.value.filter(
          (v) => v.value == dailyHours.value.pdh_day_id.value
        )[0];
        console.log("sorry no data available");
        clearManHours(d);
      }
    });
};

const clearManHours = (d) => {
  console.log(d);
  manhours.value = 0;
  dailyHours.value = {
    pdh_day_id: d,
    pdh_hours: 0,
    pdh_hours_amt: 0,
    pdh_sd_amt: 0,
    pdh_ot_reg: 0,
    pdh_ot_reg_amt: 0,
    pdh_ot_sp: 0,
    pdh_ot_sp_amt: 0,
    pdh_ot_hd: 0,
    pdh_ot_hd_amt: 0,
    pdh_otnd_reg: 0,
    pdh_otnd_reg_amt: 0,
    pdh_otnd_sp: 0,
    pdh_otnd_sp_amt: 0,
    pdh_otnd_hd: 0,
    pdh_otnd_hd_amt: 0,
    pdh_nd_reg: 0,
    pdh_nd_reg_amt: 0,
    pdh_nd_sp: 0,
    pdh_nd_sp_amt: 0,
    pdh_nd_hd: 0,
    pdh_nd_hd_amt: 0,
    pdh_hd_reg: 0,
    pdh_hd_reg_amt: 0,
    pdh_hd_sp: 0,
    pdh_hd_sp_amt: 0,
  };
};

const submitDailyHours = async () => {
  console.log(dailyHours.value);
  dailyHours.value["profile"] = form.value.profile.user_id;
  dailyHours.value["payrollPeriod"] = props.payrollPeriod.per_id;
  await hr_api
    .post("payroll/man-hours/submit-daily-hours", dailyHours.value)
    .then((response) => {
      console.log(response.data);
      getWeeklyTotal(response.data);
      $q.notify({
        color: "positive",
        position: "top",
        message: "Successfully Saved",
        icon: "done",
      });
    });
};

const getWeeklyTotal = (details) => {
  let totalHours = 0;
  let nd = 0;
  let ot = 0;
  let hd = 0;

  for (const d of details) {
    totalHours += parseFloat(d.pdh_hours);
    nd += parseFloat(d.pdh_nd_reg);
    nd += parseFloat(d.pdh_nd_hd);
    nd += parseFloat(d.pdh_nd_sp);
  }

  daysWork.value = totalHours / 8;
  totalND.value = nd;
};

const manhours = ref(0);

watch(manhours, async (newValue) => {
  const hours = newValue;
  const basic = parseFloat(form.value.profile.salary);
  console.log(hours, basic);
  const restDay = form.value.profile.restDay;
  const dutyOnRestDay = dailyHours.value.pdh_day_id.value == restDay;
  dailyHours.value.pdh_hours = hours;
  dailyHours.value.pdh_hours_amt = eval("(hours / 8) * basic");

  if (dutyOnRestDay) {
    dailyHours.value.pdh_sd_amt = eval(manHourType["prmh_sd_hrs"].formula);
  }
  if (isHoliday && dutyOnRestDay) {
    console.log("RHD");
  }

  console.log(restDay, dutyOnRestDay);
  // console.log(dailyHours);
  // console.log(manHourType);
});
</script>

<style lang="scss" scoped></style>
