<template>
  <div class="screenwide">
    <q-table
      :wrap-cells="true"
      class="screenwide"
      title="Sanctions Concluded"
      :rows="tablerows"
      :columns="columns"
      row-key="name"
      dense
      :separator="separator"
      :filter="filter"
      :loading="loading"
      :pagination="{
        rowsPerPage: 20,
      }"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            class="q-mr-xs text-black"
            @click="edit = true"
            color="warning"
            size="sm"
          >
            Send to Archive
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to update this Details</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Yes" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { date } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const props = defineProps({
  reportedViolations: [],
});
const separator = ref("horizontal");
const filter = ref("");
const tablerows = ref([]);
const edit = ref(false);
const columns = [
  {
    name: "num",
    label: "#",
    align: "center",
    field: "num",
  },
  {
    name: "dateOfOffense",
    label: "Date of Offense",
    align: "left",
    field: "dateOfOffense",
    style: "width:150px;",
  },
  {
    name: "name",
    label: "Violated By",
    align: "left",
    field: "name",
  },
  {
    name: "violations",
    label: "Violation",
    align: "left",
    field: "violations",
    style: "width:300px;",
    headerStyle: "width: 350px",
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
    style: "width:300px;",
    headerStyle: "width: 400px",
  },
  {
    name: "sanctions",
    label: "Sanctions / Actions",
    align: "center",
    field: "sanctions",
    style: "width:300px;",
    headerStyle: "width: 300px",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
    style: "width:250px;",
  },
];
console.log(props.reportedViolations);
const fetchInfractionList = async () => {
  let i = 0;
  for (const r of props.reportedViolations) {
    i++;
    const list = {
      num: i,
      dateOfOffense: date.formatDate(r.offense_date, "MMMM DD, YYYY"),
      name: r.profile.lastname + ", " + r.profile.firstname,
      violations: r.infraction.infractions,
      sanctions: r.penalty.disciplinary_action,
      description: r.details,
      reportedBy: r.reported_by,
    };

    tablerows.value.push(list);
  }
};

fetchInfractionList();
</script>

<style lang="scss" scoped></style>
