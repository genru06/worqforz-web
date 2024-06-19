<template>
  <div class="screenwide">
    <q-table
      :title="tableTitle"
      :columns="columns"
      :rows="tablerows"
      row-key="employee_id"
      selection="single"
      v-model:selected="selected"
      dense
      :separator="separator"
      :filter="filter"
      :loading="loading"
      :pagination="{
        rowsPerPage: 20,
      }"
      :rows-per-page-options="[10, 20, 50]"
      class="col-lg-12"
    >
      <template v-slot:body-cell-endDate="props">
        <q-td :props="props">
          {{ props.row.status == 3 ? props.row.dateExtend : props.row.endDate }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td v-if="gridType == '1'" :props="props">
          <q-btn
            class="q-mr-xs text-black"
            color="warning"
            @click="(resumeToWorkModal = true), (leaveID = props.row.id)"
            size="sm"
          >
            Resume to Work
          </q-btn>
          <q-btn
            class="q-mr-xs"
            color="positive"
            @click="(extendLeaveModal = true), (leaveID = props.row.id)"
            size="sm"
          >
            Extend Leave
          </q-btn>
          <q-btn
            class="q-mr-xs"
            color="negative"
            @click="(cancelLeaveModal = true), (leaveID = props.row.id)"
            size="sm"
          >
            Cancel
          </q-btn>
        </q-td>
        <q-td v-if="gridType == '2'" :props="props">
          <q-btn
            class="q-mr-xs text-black"
            color="warning"
            @click="(approveLeave = true), (leaveID = props.row.id)"
            size="sm"
          >
            Approve</q-btn
          >
          <q-btn
            class="q-mr-xs"
            color="negative"
            @click="(declineLeave = true), (leaveID = props.row.id)"
            size="sm"
          >
            Decline
          </q-btn>
        </q-td>
      </template>

      <template v-slot:top-right="props">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search here..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
            >{{ props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen" }}
          </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <q-dialog v-model="extendLeaveModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span v-if="!extend" class="q-ml-sm"
            >Are you sure you want to extend this Leave of Absence?</span
          >
          <span v-if="extend" class="q-ml-sm"
            >Please Select Date of Extension?</span
          >
        </q-card-section>
        <q-card-section v-if="extend">
          <q-input
            dense
            v-model="extendDate"
            mask="date"
            label="Date of Extension "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="extendDate">
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
            flat
            label="No"
            @click="extend = false"
            color="primary"
            v-close-popup
          />
          <q-btn
            v-if="!extend"
            dense
            label="Yes"
            @click="extend = true"
            color="positive"
            v-close-popup
          />
          <q-btn
            v-if="extend"
            dense
            label="Submit Leave Extension"
            @click="extendLeave"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="cancelLeaveModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to cancel this Leave of Absence?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="primary" v-close-popup />
          <q-btn
            dense
            label="Yes"
            @click="cancelLeave"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="resumeToWorkModal" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure this Employee will resume to work?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="primary" v-close-popup />
          <q-btn
            dense
            label="Yes"
            @click="resumeToWork"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="declineLeave" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to Decline this Leave Application?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            dense
            label="Yes"
            @click="declineLeaveApplication"
            color="negative"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="approveLeave" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to Approve this Leave Application?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            dense
            label="Yes, Approve it!"
            @click="approveLeaveApplication"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { date } from "quasar";
import { ref } from "vue";

const props = defineProps({
  tablerowDetails: [],
  tableTitle: {
    default: "Table Title",
    type: String,
  },
  gridType: {
    default: "1",
    type: String,
  },
  loading: {
    default: false,
  },
});

console.log(props.tablerowDetails);

const tablerows = ref(props.tablerowDetails || []);
const emit = defineEmits([
  "approveLeave",
  "declineLeave",
  "resumeToWork",
  "extendLeave",
  "cancelLeave",
]);

const approveLeave = ref(false);
const declineLeave = ref(false);
const resumeToWorkModal = ref(false);
const extendLeaveModal = ref(false);
const cancelLeaveModal = ref(false);
const extend = ref(false);
const extendDate = ref(date.formatDate(Date.now(), "YYYY-MM-DD"));

const leaveID = ref();

const extendLeave = () => {
  emit("extendLeave", leaveID.value, extendDate.value);
};

const cancelLeave = () => {
  emit("cancelLeave", leaveID.value);
};

const resumeToWork = () => {
  emit("resumeToWork", leaveID.value);
};

const approveLeaveApplication = () => {
  emit("approveLeave", leaveID.value);
};

const declineLeaveApplication = () => {
  emit("declineLeave", leaveID.value);
};
const separator = ref("horizontal");
const filter = ref("");
const columns = [
  {
    name: "name",
    required: true,
    label: "Name of Personnel",
    align: "left",
    field: "name",
  },
  {
    name: "department",
    required: true,
    label: "Department",
    align: "left",
    field: "department",
  },
  {
    name: "position",
    required: true,
    label: "Position",
    align: "left",
    field: "position",
  },
  {
    name: "leaveType",
    required: true,
    label: "Leave Type",
    align: "left",
    field: "leaveType",
  },
  {
    name: "noDays",
    required: true,
    label: "No. of Days",
    align: "left",
    field: "noDays",
  },
  {
    name: "startDate",
    required: true,
    label: "Start Date",
    align: "left",
    field: "startDate",
    sortable: true,
    sortOrder: "ad",
  },
  {
    name: "endDate",
    required: true,
    label: "End Date",
    align: "left",
    field: "endDate",
  },
  {
    name: "reason",
    required: true,
    label: "Reason",
    align: "left",
    field: "reason",
  },
  {
    name: "actions",
    label: "ACTION",
    align: "center",
    field: "actions",
  },
];
</script>

<style scoped></style>
