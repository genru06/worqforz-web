<template>
  <div class="screenwide">
    <q-table
      :wrap-cells="true"
      class="screenwide"
      title="Employees in Admin Hearing"
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
              editInfraction(props.row.id, props.row.infraction_id),
                (updateTitle = 'Update AH Status')
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
        <q-bar>
          <q-icon name="add" />
          <div>{{ updateTitle }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-select
            v-model="suspensionDetails.penalty"
            :options="penaltyOptions"
            label="Penalty Imposed"
            dense
            :option-label="(v) => v.disciplinary_action"
            :option-value="(v) => v.id"
          />
        </q-card-section>
        <q-card-section v-if="!forSuspension">
          <q-input
            class="col"
            dense
            v-model="we_received"
            mask="date"
            label="Date : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="we_received">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section v-if="forSuspension">
          <q-input
            class="col"
            dense
            v-model="suspensionDetails.suspended_date_from"
            mask="date"
            label="Date From : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="suspensionDetails.suspended_date_from">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            class="col"
            dense
            v-model="suspensionDetails.suspended_date_to"
            mask="date"
            label="Date To : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="suspensionDetails.suspended_date_to">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Written Warning"
            color="warning"
            @click="updateInfraction(1, 'we_received')"
            v-close-popup
          />
          <q-btn
            v-if="!forSuspension"
            label="For Suspension"
            color="positive"
            @click="forSuspension = true"
          />
          <q-btn
            v-if="forSuspension"
            label="Update Suspension Details"
            color="positive"
            @click="suspendPersonnel"
            v-close-popup
          />
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
  infractionSections: [],
});
const emit = defineEmits(["updateInfractionList"]);
const separator = ref("horizontal");
const filter = ref("");
const tablerows = ref([]);
const rows = ref([]);
const edit = ref(false);
const updateTitle = ref();
const infractionListID = ref();
const nte = ref();
const penaltyOptions = ref([]);
const forSuspension = ref(false);
const suspensionDetails = ref({
  suspended_date_from: date.formatDate(Date.now(), "YYYY-MM-DD"),
  suspended_date_to: date.formatDate(Date.now(), "YYYY-MM-DD"),
  status: 8,
  is_suspended: true,
  penalty: null,
});

const columns = [
  {
    name: "num",
    label: "#",
    align: "center",
    field: "num",
    style: "width:50px;",
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
    headerStyle: "width: 300px",
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
    style: "width:300px;",
    headerStyle: "width: 300px",
  },
  {
    name: "date_received",
    label: "Date Received",
    align: "left",
    field: "date_received",
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

const editInfraction = (id, infraction_id) => {
  edit.value = true;
  infractionListID.value = id;
  penaltyOptions.value = getPenaltyOptions(infraction_id);
};

const suspendPersonnel = async () => {
  await hr_api
    .patch("infraction/list/" + infractionListID.value, suspensionDetails.value)
    .then((response) => {
      emit("updateInfractionList");
    });
};

const search = (val) => {
  const needle = val.toLowerCase();
  tablerows.value = rows.value.filter(
    (v) => v.lastname.toLowerCase().indexOf(needle) > -1
  );
};

const updateInfraction = async (status, column) => {
  const updateDetails = {
    [column]: nte.value,
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

  // console.log(props.reportedViolations);
  for (const r of props.reportedViolations) {
    i++;
    const infractionID = r.infraction.id;
    // console.log(infractionID);
    // penaltyOptions.value = getPenaltyOptions(infractionID);
    const list = {
      id: r.id,
      num: i,
      dateOfOffense: date.formatDate(r.offense_date, "MMMM DD, YYYY"),
      name: r.profile.lastname + ", " + r.profile.firstname,
      violations: r.infraction.infractions,
      date_sent: date.formatDate(r.nte, "MMMM DD, YYYY"),
      date_received:
        r.nte_received != "1899-11-30"
          ? date.formatDate(r.we, "MMMM DD, YYYY")
          : "",
      description: r.details,
      infraction_id: r.infraction.id,
    };

    tablerows.value.push(list);
    rows.value.push(list);
  }
};

const getPenaltyOptions = (id) => {
  let details = [];
  let section = props.infractionSections;
  for (const s of section) {
    const infraction = s.infractions;
    for (const i of infraction) {
      const row = {
        id: i.id,
        da: i.disciplinaryAction,
      };
      details.push(row);
    }
  }
  let filteredOptions = details.filter((v) => {
    return v.id == id;
  });
  return filteredOptions[0].da;
};

fetchInfractionList();
</script>

<style lang="scss" scoped></style>
