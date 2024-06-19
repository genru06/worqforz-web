<template>
  <div>
    <HeaderLayout mainTitle="HR" moduleTitle="Training Setup">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn outline color="grey-8" to="/hr/training" label="Training Plan" />
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
      <q-btn color="grey-8" to="/hr/training/setup" label="Training Setup" />
    </HeaderLayout>
    <q-separator />
    <div class="row q-gutter-sm q-pa-md">
      <div class="col-8">
        <q-card class="my-card">
          <q-card-section class="row">
            <div class="text-h6 col">Training Plan List</div>
            <q-space /><q-btn
              dense
              color="primary"
              icon="add"
              @click="trainingPlanModal = true"
            />
          </q-card-section>
          <q-separator />
          <q-card-section
            ><q-table
              :rows="trainingPlan"
              :columns="trainingPlanColumns"
              row-key="name"
              :pagination="{
                rowsPerPage: 20,
              }"
              dense
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-card class="my-card">
          <q-card-section class="row">
            <div class="text-h6">List of Training Type</div>

            <q-space /><q-btn
              dense
              color="primary"
              icon="add"
              @click="trainingTypeModal = true"
            />
          </q-card-section>
          <q-separator />
          <q-table
            :rows="trainingType"
            :columns="trainingTypeColumns"
            row-key="name"
            hideBottom
            dense
            :pagination="{
              rowsPerPage: 20,
            }"
            ><template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  @click="() => editType(props.row.id)"
                  size="sm"
                  dense
                  color="warning"
                  icon="edit"
                />
                <q-btn size="sm" dense color="negative" icon="delete" />
              </q-td> </template
          ></q-table>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="trainingPlanModal">
      <q-card style="width: 400px">
        <q-bar dark class="bg-primary text-white">
          <div class="text-weight-bold">Add Training Plan</div>
          <q-space />
          <q-btn
            @click="trainingPlanModal = false"
            dense
            round
            icon="close"
            size="8px"
            color="red"
          />
        </q-bar>
        <q-card-section>
          <q-input
            dense
            v-model="trainingDetails.tp_training_title"
            type="text"
            label="Training Title"
          />
          <q-select
            dense
            v-model="trainingDetails.trainingType"
            :options="trainingType"
            :option-label="(v) => v.type"
            :option-value="(v) => v.id"
            label="Training Type"
            use-input
            hide-selected
            fill-input
            map-options
          />
          <div class="row q-gutter-md">
            <q-input
              class="col"
              dense
              v-model="trainingDetails.tp_date"
              mask="date"
              label="Scheduled Date"
              bg-color="white"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="trainingDetails.tp_date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              dense
              class="col"
              v-model="trainingDetails.tp_expected_participants"
              type="text"
              label="Expected Participants"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn dense label="Cancel" color="negative" v-close-popup />
          <q-btn
            dense
            label="Add Plan"
            @click="addTrainingPlan"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="trainingTypeModal">
      <q-card>
        <q-bar dark class="bg-primary text-white">
          <div class="col text-weight-bold">Add Training Type</div>
          <q-btn
            @click="trainingTypeModal = false"
            dense
            round
            icon="close"
            size="8px"
            color="red"
          />
        </q-bar>
        <q-card-section class="row items-center">
          <q-input v-model="type" type="text" label="Training Type" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn dense label="Cancel" color="negative" v-close-popup />
          <q-btn
            dense
            label="Add Type"
            @click="addTrainingType"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { date, useQuasar } from "quasar";
import { hr_api } from "boot/axios";
import HeaderLayout from "../../../layouts/HeaderLayout.vue";

const $q = useQuasar();

const trainingPlanModal = ref(false);
const trainingTypeModal = ref(false);

const trainingType = ref([]);
const trainingPlan = ref([]);
const type = ref([]);

const trainingDetails = ref({
  tp_training_title: "",
  trainingType: "",
  tp_date: date.formatDate(Date.now(), "YYYY-MM-DD"),
  tp_expected_participants: 0,
});

const addTrainingType = async () => {
  hr_api.post("hr/training/type/add", { type: type.value }).then((response) => {
    $q.notify({
      color: "positive",
      position: "top",
      message: "Training Type successfully Added",
      icon: "check",
    });
  });
};

const addTrainingPlan = async () => {
  api
    .post("hr/training/plan/list/add", trainingDetails.value)
    .then((response) => {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Training Plan successfully Added",
        icon: "check",
      });
    });
};

const fetchTrainingPlan = async () => {
  hr_api.get("hr/training/plan/all").then((response) => {
    let count = 1;

    for (const res of response.data) {
      trainingPlan.value.push({
        num: count++,
        title: res.tp_training_title,
        type: res.trainingType?.type,
        schedule: date.formatDate(res.tp_date, "MMMM DD, YYYY"),
        participants: res.tp_expected_participants,
      });
    }

    console.log(response.data);
  });
};

const fetchTrainingType = async () => {
  hr_api.get("hr/training/type").then((response) => {
    let count = 1;
    for (const res of response.data) {
      trainingType.value.push({
        num: count++,
        id: res.id,
        type: res.type,
      });
    }
  });
};

const trainingPlanColumns = [
  {
    name: "num",
    required: true,
    label: "#",
    align: "center",
    field: "num",
  },
  {
    name: "title",
    required: true,
    label: "Training Title",
    align: "left",
    field: "title",
  },
  {
    name: "type",
    required: true,
    label: "Training Type",
    align: "left",
    field: "type",
  },
  {
    name: "schedule",
    required: true,
    label: "Date Scheduled",
    align: "center",
    field: "schedule",
  },
  {
    name: "participants",
    required: true,
    label: "Expected Participants",
    align: "center",
    field: "participants",
  },
];

const trainingTypeColumns = [
  {
    name: "num",
    required: true,
    label: "#",
    align: "center",
    field: "num",
  },
  {
    name: "type",
    required: true,
    label: "Type",
    align: "left",
    field: "type",
  },
  {
    name: "action",
    required: true,
    label: "Action",
    align: "center",
    field: "action",
    style: "vertical-align:middle",
  },
];

fetchTrainingPlan();
fetchTrainingType();
</script>

<style lang="scss" scoped></style>
