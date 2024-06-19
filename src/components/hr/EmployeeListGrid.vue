<template>
  <div>
    <q-table
      title="Employee Masterlist"
      :rows="tablerows"
      :columns="columns"
      row-key="employee_id"
      selection="single"
      dense
      :separator="separator"
      :loading="loading"
      :pagination="{
        rowsPerPage: 20,
      }"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:body-cell-employee_id="props">
        <q-td :props="props">
          {{ props.row.employee.employee_id }}
        </q-td>
      </template>
      <template v-slot:body-cell-position="props">
        <q-td :props="props">
          {{ props.row.employee.position.position }}
        </q-td>
      </template>
      <template v-slot:body-cell-tin="props">
        <q-td :props="props">
          {{ props.row.employee.tin }}
        </q-td>
      </template>
      <template v-slot:body-cell-bank_account="props">
        <q-td :props="props">
          {{ props.row.employee.bank_account }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            class="q-mr-xs"
            dense
            color="positive"
            size="sm"
            icon="visibility"
            :to="'/hr/employee/details/' + props.row.employee.employee_id"
          />
          <q-btn
            dense
            color="red"
            size="sm"
            icon="delete"
            @click="confirmDeleteRecord(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:top-right>
        <q-btn-group>
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
          <q-btn-dropdown auto-close color="primary" label="Export">
            <q-list bordered>
              <q-item clickable @click="employeeBankAccount" v-ripple>
                <q-item-section>Employee Bank Account #s</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn color="secondary" icon="upload" @click="uploadForm = true" />
        </q-btn-group>

        <!-- <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
            >{{ props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen" }}
          </q-tooltip>
        </q-btn> -->
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="priority_high" color="negative" text-color="white" />
          <span class="q-ml-lg col-lg-10"
            >Are you sure you want to delete this employee's record, please note
            that you cannot undo this process</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="YES"
            @click="deleteRecord"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="uploadForm">
      <q-card>
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Select File</div>
          <q-btn
            @click="uploadForm = false"
            dense
            flat
            round
            icon="close"
            size="8.5px"
            color="white"
          />
        </q-bar>
        <q-uploader
          :url="uploadURL"
          square
          flat
          bordered
          style="max-width: 300px"
          field-name="file"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { LocalStorage, date } from "quasar";
import { ref } from "vue";
import { hr_api } from "../../boot/axios";
const confirm = ref(false);
const fromDate = ref();
const toDate = ref();

const uploadForm = ref(false);
const uploadURL = ref(process.env.HR_API_URL + "employee/upload/");

const props = defineProps({
  emStatus: {
    type: Number,
    default: 1,
  },
  profiles: {
    type: Number,
    default: 0,
  },
});

const separator = ref("horizontal");
const tablerows = ref([]);
const rows = ref([]);
const loading = ref(false);
const filter = ref("");
const emStatus = ref(props.emStatus);
const selectedDetails = ref();

const confirmDeleteRecord = (details) => {
  selectedDetails.value = details;
  confirm.value = true;
};

const deleteRecord = async () => {
  const id = selectedDetails.value.user_id;
  await hr_api.delete("profile/" + id).then((res) => {
    console.log(res);
    loadData();
  });
};

const columns = [
  {
    name: "employee_id",
    required: true,
    label: "EMPLOYEE ID",
    align: "left",
    field: "employee_id",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "lastname",
    required: true,
    label: "LAST NAME",
    align: "left",
    field: "lastname",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "firstname",
    align: "left",
    label: "FIRSTNAME",
    field: "firstname",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "middlename",
    label: "MIDDLENAME",
    field: "middlename",
    align: "left",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "position",
    label: "POSITION",
    field: "position",
    align: "left",
  },
  {
    name: "tin",
    label: "TIN",
    field: "tin",
    align: "left",
  },
  {
    name: "bank_account",
    label: "ACCOUNT #",
    field: "bank_account",
    align: "left",
  },
  {
    name: "actions",
    label: "ACTION",
    align: "center",
  },
];

const search = (val) => {
  const needle = val.toLowerCase();
  tablerows.value = rows.value.filter(
    (v) => v.lastname.toLowerCase().indexOf(needle) > -1
  );
};

const generateFortNightly = () => {
  const from = date.formatDate(fromDate.value, "YYYY-MM-DD");
  const to = date.formatDate(toDate.value, "YYYY-MM-DD");
  const url =
    process.env.hr_api_URL + "reports/hr/forNightly/" + from + "/" + to + "/1";
  window.open(url, "_blank");
};

const employeeBankAccount = () => {
  const url = process.env.hr_api_URL + "reports/hr/employee-w-bank-accounts";
  console.log(url);
  window.open(url, "_blank");
};

const emit = defineEmits(["totalEmployees"]);

const loadData = () => {
  loading.value = true;
  hr_api
    .get("/profile/all/" + emStatus.value)
    .then((response) => {
      tablerows.value = response.data;
      rows.value = response.data;
      loading.value = false;
      emit("totalEmployees", response.data.length);
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Loading failed",
        icon: "report_problem",
      });
    });
};

const getAllProfileByWorkplace = async () => {
  loading.value = true;
  await hr_api
    .get("/profile/all/workplace/" + emStatus.value)
    .then((response) => {
      tablerows.value = response.data;
      rows.value = response.data;
      loading.value = false;
      emit("totalEmployees", response.data.length);
    })
    .catch(() => {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Loading failed",
        icon: "report_problem",
      });
    });
};

getAllProfileByWorkplace();
</script>

<style lang="scss" scoped></style>
