<template>
  <div class="screenwide">
    <q-table
      :wrap-cells="true"
      class="screenwide"
      title="List of Suspended Personel"
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
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          @update:model-value="(v) => search(v)"
          placeholder="Search here..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            class="q-mr-xs text-black"
            @click="
              editInfraction(props.row.id),
                (updateTitle = 'Update Suspension Status')
            "
            color="warning"
            size="sm"
          >
            Update
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to close this case?</span>
        </q-card-section>
        <q-card-actions align="right"
          ><q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn
            label="Yes"
            color="positive"
            @click="updateInfraction(1)"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { date } from "quasar";
import { ref } from "vue";
import { hr_api } from "../../boot/axios";

const props = defineProps({
  reportedViolations: [],
});
const emit = defineEmits(["updateInfractionList"]);
const separator = ref("horizontal");
const filter = ref("");
const tablerows = ref([]);
const rows = ref([]);
const edit = ref(false);
const updateTitle = ref();
const infractionListID = ref();

const columns = [
  {
    name: "num",
    label: "#",
    align: "center",
    field: "num",
    style: "width:50px;",
  },
  {
    name: "name",
    label: "Name of Personnel",
    align: "left",
    field: "name",
    style: "width:150px;",
  },
  {
    name: "violations",
    label: "Violation",
    align: "left",
    field: "violations",
    style: "width:300px;",
    headerStyle: "width: 300px",
  },
  {
    name: "description",
    label: "Description",
    align: "left",
    field: "description",
    style: "width:250px;",
  },
  {
    name: "numberOfDays",
    label: "Days of Suspension",
    align: "center",
    field: "numberOfDays",
    style: "width:50px;",
  },
  {
    name: "suspensionStartDate",
    label: "Start Date of Suspension",
    align: "center",
    field: "suspensionStartDate",
    style: "width:150px;",
  },
  {
    name: "suspensionEndDate",
    label: "End Date of Suspension",
    align: "center",
    field: "suspensionEndDate",
    style: "width:150px;",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
    style: "width:100px;",
  },
];

const search = (val) => {
  const needle = val.toLowerCase();
  tablerows.value = rows.value.filter(
    (v) => v.lastname.toLowerCase().indexOf(needle) > -1
  );
};

const editInfraction = (id) => {
  edit.value = true;
  infractionListID.value = id;
};

const updateInfraction = async (status) => {
  const updateDetails = {
    is_suspended: false,
    status: status,
  };
  await hr_api
    .patch("infraction/list/" + infractionListID.value, updateDetails)
    .then((response) => {
      emit("updateInfractionList");
    });
};

const fetchInfractionList = async () => {
  let i = 0;
  for (const r of props.reportedViolations) {
    i++;
    const numDays = date.getDateDiff(
      r.suspended_date_to,
      r.suspended_date_from,
      "days"
    );
    const list = {
      id: r.id,
      num: i,
      name: r.profile.lastname + ", " + r.profile.firstname,
      violations: r.infraction.infractions,
      suspensionStartDate: date.formatDate(
        r.suspended_date_from,
        "MMMM DD, YYYY"
      ),
      suspensionEndDate: date.formatDate(r.suspended_date_to, "MMMM DD, YYYY"),
      description: r.details,
      numberOfDays: numDays + 1,
    };

    tablerows.value.push(list);
    rows.value.push(list);
  }
};

fetchInfractionList();
</script>

<style lang="scss" scoped></style>
