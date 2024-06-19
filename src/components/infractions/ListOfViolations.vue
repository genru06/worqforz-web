<template>
  <div class="screenwide">
    <q-table
      :wrap-cells="true"
      class="screenwide"
      title="List of Violations"
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
            @click="editInfraction(props.row.id)"
            color="warning"
            size="sm"
          >
            Send Notice to Explain
          </q-btn>
          <q-btn
            @click="(selectedRow = props.row), (confirmDelete = true)"
            class="q-mr-xs"
            color="negative"
            size="sm"
          >
            Delete
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
          <q-input
            class="col"
            dense
            v-model="nte"
            mask="date"
            label="Date Sent : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="nte">
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
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="Send"
            color="positive"
            @click="sendNoticeToExplain"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to Delete this Violation?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="NO" color="primary" v-close-popup />
          <q-btn
            flat
            label="YES"
            @click="deleteViolation"
            color="primary"
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
});
const emit = defineEmits(["updateInfractionList"]);
const separator = ref("horizontal");
const filter = ref("");
const tablerows = ref([]);
const edit = ref(false);
const updateTitle = ref();
const infractionListID = ref();
const nte = ref();
const confirmDelete = ref(false);
const selectedRow = ref();

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
    name: "reportedBy",
    label: "Reported By",
    align: "left",
    field: "reportedBy",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    field: "actions",
    style: "width:450px;",
  },
];

const deleteViolation = async () => {
  console.log(selectedRow.value.id);
  await hr_api.delete("infraction/" + selectedRow.value.id).then((response) => {
    fetchInfractionList();
  });
};

const editInfraction = (id) => {
  edit.value = true;
  infractionListID.value = id;
  updateTitle.value = "Send Notice to Explain";
};

const sendNoticeToExplain = async () => {
  const updateDetails = {
    nte: nte.value,
    status: 4,
  };
  await hr_api
    .patch("infraction/list/" + infractionListID.value, updateDetails)
    .then((response) => {
      emit("updateInfractionList");
    });
};
const fetchInfractionList = async () => {
  let i = 0;
  tablerows.value = [];
  for (const r of props.reportedViolations) {
    if (r.profile) {
      i++;
      const list = {
        id: r.id,
        num: i,
        dateOfOffense: date.formatDate(r.offense_date, "MMMM DD, YYYY"),
        name: r.profile.lastname + ", " + r.profile.firstname,
        violations: r.infraction.infractions,
        date_received: date.formatDate(r.date_received, "MMMM DD, YYYY"),
        description: r.details,
        reportedBy: r.reported_by,
      };

      tablerows.value.push(list);
    }
  }
};

fetchInfractionList();
</script>

<style lang="scss" scoped></style>
