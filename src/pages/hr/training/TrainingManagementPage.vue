<template>
  <div>
    <HeaderLayout mainTitle="HR" moduleTitle="Training Management">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn color="grey-8" to="/hr/training" label="Training Plan" />
      <q-btn
        outline
        color="grey-8"
        to="/hr/training/pending"
        label="Pending Trainings"
      />
      <q-btn
        outline
        color="grey-8"
        to="/hr/training/completed"
        label="Completed Trainings"
      />
      <q-btn
        outline
        color="grey-8"
        to="/hr/training/setup"
        label="Training Setup"
      />
    </HeaderLayout>
    <q-separator />
    <div class="q-pa-md row">
      <div class="col-8 q-pa-sm">
        <FullCalendar ref="fullCalendar" :options="options" />
      </div>
      <div class="col-4 q-pa-sm">
        <h6 class="text-center q-mt-md q-mb-md">Trainings for the Month</h6>
        <FullCalendar ref="fullCalendarList" :options="listOptions" />
      </div>
    </div>
    <q-dialog v-model="schedModal" persistent>
      <q-card style="width: 300px">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add Training Plan</div>
          <q-btn
            dense
            round
            icon="close"
            size="7px"
            color="red"
            v-close-popup
          />
        </q-bar>
        <q-card-section>
          <p class="text-center q-mb-sm text-bold">
            Date : {{ trainingPlanDetails.tp_date }}
          </p>
          <q-separator />
          <q-input
            class="q-mb-md q-mt-sm"
            v-model="trainingPlanDetails.tp_training_title"
            dense
            type="text"
            label="Training Title"
          />
          <q-select
            class="q-mb-md"
            v-model="trainingPlanDetails.trainingType"
            dense
            :options="tpTypeOptions"
            optionLabel="type"
            optionValue="id"
            label="Training Type"
          />
          <q-input
            v-model="trainingPlanDetails.tp_expected_participants"
            type="text"
            label="Expected Participants"
            dense
          />
          <q-input
            v-model="trainingPlanDetails.tp_conducted_by"
            type="text"
            label="Conducted By"
            dense
          />
          <q-input
            v-model="trainingPlanDetails.tp_conducted_in"
            type="text"
            label="Conducted In"
            dense
          />
        </q-card-section>
        <q-separator inset />
        <q-card-actions align="right">
          <q-btn
            dense
            label="Save Plan"
            color="primary"
            v-close-popup
            @click="savePlan"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { date, useQuasar } from "quasar";
import { hr_api } from "boot/axios";
import HeaderLayout from "../../../layouts/HeaderLayout.vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

const $q = useQuasar();
const schedModal = ref(false);
const fullCalendar = ref(null);
const fullCalendarList = ref(null);
let initialDate = ref(date.formatDate(Date.now(), "YYYY-MM-DD"));
const trainingPlanDetails = ref({
  tp_training_title: "",
  trainingType: [],
  tp_date: date.formatDate(Date.now(), "YYYY-MM-DD"),
  tp_expected_participants: 0,
  tp_conducted_by: "",
  tp_conducted_in: "",
  tp_time: date.formatDate(Date.now(), "HH:mm:ss"),
});

let numdays;

let event = [];

const dateRange = {
  from: "",
  to: "",
};

const tpTypeOptions = ref([]);

const options = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  customButtons: {
    prev: {
      // this overrides the prev button
      text: "PREV",
      click: (v) => {
        fullCalendar.value.calendar.prev();
        fullCalendarList.value.calendar.prev();
        getTrainingPlan();
      },
    },
    next: {
      // this overrides the next button
      text: "NEXT",
      click: (v) => {
        fullCalendar.value.calendar.next();
        fullCalendarList.value.calendar.next();
        getTrainingPlan();
      },
    },
  },
  initialView: "dayGridMonth",
  editable: true,
  selectable: true,
  select: (arg) => {
    schedModal.value = true;
    trainingPlanDetails.value.tp_date = date.formatDate(
      arg.start,
      "YYYY-MM-DD"
    );
    trainingPlanDetails.value.tp_time = date.formatDate(arg.start, "HH:mm:ss");
    console.log(arg);
  },
  events: event,
});
let listOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  headerToolbar: false,
  initialView: "listMonth",
  events: [],
});

const getTrainingType = async () => {
  await hr_api.get("hr/training/type").then((response) => {
    for (const res of response.data) {
      tpTypeOptions.value.push({
        id: res.id,
        type: res.type,
      });
    }
    console.log(tpTypeOptions);
  });
};

const getTrainingPlan = async () => {
  numdays = date.daysInMonth(fullCalendar.value.getApi().getDate());
  dateRange.from =
    date.formatDate(fullCalendar.value.getApi().getDate(), "YYYY-MM-") + "01";
  dateRange.to =
    date.formatDate(fullCalendar.value.getApi().getDate(), "YYYY-MM-") +
    numdays;

  await api
    .get("hr/training/month/range/" + dateRange.from + "/" + dateRange.to)
    .then((response) => {
      options.events = [];
      listOptions.events = [];
      let event = {};
      for (let res of response.data) {
        let start = res.tp_time
          ? date.formatDate(res.tp_date, "YYYY-MM-DD " + res.tp_time)
          : date.formatDate(res.tp_date, "YYYY-MM-DD");
        event = {
          title: res.tp_training_title,
          start: start,
          backgroundColor: "green",
          borderColor: "green",
        };
        options.events.push(event);
        listOptions.events.push(event);
      }
    });
};

const savePlan = async () => {
  await api
    .post("hr/training/plan/create", trainingPlanDetails.value)
    .then((response) => {
      if (response.status == 201) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Training Plan Created Successfully",
          icon: "check",
        });
        getTrainingPlan();
      }
    });
};

onMounted(() => {
  getTrainingType();
  getTrainingPlan();
  console.log(fullCalendar.value.getApi());
});
</script>

<style lang="scss" scoped></style>
