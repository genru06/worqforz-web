<template>
  <div>
    <HeaderLayout mainTitle="HR" moduleTitle="Pending Trainings">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn outline color="grey-8" to="/hr/training" label="Training Plan" />
      <q-btn
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
    <div class="q-pa-md">
      <q-table
        title="Pending Trainings"
        dense
        :rows="tablerows"
        :columns="columns"
        row-key="name"
        :loading="loading"
        :pagination="{
          rowsPerPage: 20,
        }"
      >
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            @update:model-value="(v) => search(v)"
            placeholder="Search Pending Trainings"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { date, useQuasar } from "quasar";
import { hr_api } from "boot/axios";
import HeaderLayout from "../../../layouts/HeaderLayout.vue";

const tablerows = ref([]);
const rows = ref([]);

const getPendingTrainings = async () => {
  await hr_api.get("hr/training/pending").then((response) => {
    console.log(response.data);
    let i = 0;
    let data = {};
    for (let res of response.data) {
      i++;
      data = {
        num: i,
        title: res.tp_training_title,
        type: res.trainingType.type,
        trainingDate: date.formatDate(res.tp_date, "MMMM DD, YYYY"),
        expectedParticipants: res.tp_expected_participants,
        conductedBy: res.tp_conducted_by
          ? res.tp_conducted_by.toUpperCase()
          : "",
        conductedAt: res.tp_conducted_in || "",
      };

      tablerows.value.push(data);
      rows.value.push(data);
    }
  });
};

const search = (val) => {
  const needle = val.toLowerCase();
  tablerows.value = rows.value.filter(
    (v) => v.title.toLowerCase().indexOf(needle) > -1
  );
};

const columns = [
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
    sortable: true,
    style: "width: 350px",
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "type",
    required: true,
    label: "Training Type",
    align: "left",
    field: "type",
    sortable: true,
    headerStyle: "width: 350px",
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "trainingDate",
    required: true,
    label: "Date Scheduled",
    align: "left",
    field: "trainingDate",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "expectedParticipants",
    required: true,
    label: "Expected Participants",
    align: "center",
    field: "expectedParticipants",
  },
  {
    name: "conductedBy",
    required: true,
    label: "Conducted By",
    align: "left",
    field: "conductedBy",
  },
  {
    name: "conductedAt",
    required: true,
    label: "Conducted At",
    align: "left",
    field: "conductedAt",
  },
];

onBeforeMount(() => {
  getPendingTrainings();
});
</script>

<style lang="scss" scoped></style>
