<template>
  <div>
    <q-bar dark class="bg-primary text-white">
      <div class="col text-left text-weight-bold">Edit</div>
      <q-btn flat round dense icon="save" @click="submitEdit" />
      <q-btn flat round dense icon="close" v-close-popup />
    </q-bar>
    <!-- <q-toolbar>
      <q-toolbar-title>
        <span class="text-weight-bold">Edit</span>
        <span style="float: right">
          <q-btn flat round dense icon="save" @click="submitEdit" />
          <q-btn flat round dense icon="close" v-close-popup />
        </span>
      </q-toolbar-title>
    </q-toolbar> -->
    <q-card flat class="my-card">
      <q-card-section class="q-py-none">
        <q-input
          class="q-pa-none"
          v-model="editInfo.basic.lastname"
          dense
          type="text"
          label="Last Name :"
          :rules="[(val) => (val && val.length > 0) || 'Last Name is Required']"
        />
        <q-input
          class="q-pa-none"
          dense
          v-model="editInfo.basic.firstname"
          type="text"
          label="First Name :"
          :rules="[
            (val) => (val && val.length > 0) || 'First Name is Required',
          ]"
        />
        <q-input
          class="q-pa-none"
          dense
          v-model="editInfo.basic.middlename"
          type="text"
          label="Middle Name :"
        />
      </q-card-section>
      <q-card-section class="q-py-none">
        <q-select
          option-value="id"
          option-label="name"
          label="Select Workplace"
          :options="workplaceOptions"
          dense
          v-model="editInfo.employee.workplace"
        />
        <q-select
          class="q-pa-none"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="departmentSelect"
          :options="departmentOptions"
          @filter="departmentFn"
          option-label="department"
          option-value="id"
          label="Select Department"
          bg-color="white"
          :rules="[(val) => val || 'Please Select a Department']"
          @update:model-value="fetchPosition"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          class="q-pa-none"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="editInfo.employee.position"
          :options="positionOptions"
          @filter="positionFn"
          option-label="position"
          option-value="id"
          label="Select Position"
          bg-color="white"
          :rules="[(val) => val || 'Please Select a Position']"
          @update:model-value="fetchPosition"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-py-none">
        <!-- <q-select
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="editInfo.employee.section"
          :options="sectionOptions"
          @filter="sectionFn"
          option-label="section_name"
          option-value="section_id"
          label="Select Section"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select> -->
        <q-input
          dense
          v-model="editInfo.employee.date_hired"
          mask="date"
          label="Date Hired : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="editInfo.employee.date_hired">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="editInfo.employee.em_status"
          :options="emStatusOptions"
          @filter="emStatusFn"
          option-label="employment_status"
          option-value="id"
          label="Employment Status :"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          class="q-mb-md"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="editInfo.employee.act_status"
          :options="accStatusOptions"
          option-label="act_status"
          option-value="id"
          label="Account Status :"
          bg-color="white"
          @update:model-value="(v) => setAccountStatus(v)"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
    </q-card>
    <q-dialog v-model="resignModal">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-input
            dense
            v-model="editInfo.employee.resigned_date"
            mask="date"
            label="Date Resigned : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="editInfo.employee.resigned_date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="items-center">
          <q-input
            v-model="editInfo.employee.remarks"
            filled
            dense
            label="Remarks"
            type="textarea"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Submit"
            color="primary"
            @click="submitEdit"
            v-close-popup="2"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deactivationModal" persistent>
      <q-card>
        <q-bar dark class="bg-primary text-white">
          <q-btn
            dense
            flat
            round
            v-close-popup
            icon="lens"
            size="8.5px"
            color="red"
          />
          <div class="col text-center text-weight-bold">
            Reason for Deactivation
          </div>
        </q-bar>
        <q-card-section
          ><q-select
            dense
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            v-model="editInfo.employee.deactivation_status"
            :options="deactStatusOptions"
            @filter="deactStatusFn"
            option-label="account_status"
            option-value="id"
            label="Deactivation Status :"
            bg-color="white"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { hr_api } from "src/boot/axios";
import { useConstants } from "../../stores/constants";

const props = defineProps({
  basicInfo: {},
  constant: {},
});
const constants = useConstants();

constants.fetchDepartments();
constants.fetchAllWorkplace();
const employeeInfo = ref(props.basicInfo.employee);
const employementStatus = ref(props.basicInfo.employee.em_status);
const workplaceOptions = ref(constants.getWorkplace);
const department = [];
const departmentSelect = ref(props.basicInfo.employee.position.department);
const departmentOptions = ref(props.constant.getDepartments);
let pos = [];
const positionOptions = ref([]);
// const sections = [];
// const sectionOptions = ref(JSON.parse(props.constant.getSections));
const editInfo = ref({
  basic: {
    user_id: props.basicInfo.user_id,
    lastname: props.basicInfo.lastname,
    middlename: props.basicInfo.middlename,
    firstname: props.basicInfo.firstname,
  },
  employee: {
    position: employeeInfo.value.position,
    workplace: employeeInfo.value.workplace,
    date_hired: employeeInfo.value.date_hired,
    section: employeeInfo.value.section,
    em_status: employementStatus.value != null ? employementStatus.value : null,
    act_status: null,
    deactivation_status: 0,
    resigned_date: null,
    remarks: null,
  },
});

const resignModal = ref(false);
const deactivationModal = ref(false);
const actStatus = ref();

console.log(editInfo.value);

const emit = defineEmits(["update"]);

const submitEdit = async () => {
  editInfo.value["employee"].act_status = actStatus.value;
  await hr_api.patch(
    "employee/" + employeeInfo.value.employee_id,
    editInfo.value
  );
  emit("update");
};

const sectionFn = async (val, update, abort) => {
  const sect = sectionOptions.value;
  if (sections.length == 0) {
    for (const s in sect) {
      sections.push(sect[s]);
    }
  }
  update(() => {
    const needle = val.toLowerCase();
    sectionOptions.value = sections.filter(
      (v) => v.section_name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const departmentFn = async (val, update, abort) => {
  const dept = departmentOptions.value;
  if (department.length == 0) {
    for (const d in dept) {
      department.push(dept[d]);
    }
  }
  update(() => {
    const needle = val.toLowerCase();
    departmentOptions.value = department.filter(
      (v) => v.department.toLowerCase().indexOf(needle) > -1
    );
  });
};
const accStatus = [
  {
    id: 1,
    act_status: "Active",
  },
  {
    id: 2,
    act_status: "Suspended",
  },
  {
    id: 3,
    act_status: "Resigned",
  },
  {
    id: 0,
    act_status: "Deactivated",
  },
];

const accStatusOptions = ref(accStatus);

const getAccountStatus = () => {
  let status = accStatus.filter(
    (v) => v.id == props.basicInfo.employee.act_status
  );
  editInfo.value["employee"].act_status = status[0];
};

getAccountStatus();

const setAccountStatus = (status) => {
  switch (status.id) {
    case 0:
      deactivationModal.value = true;
      actStatus.value = status.id;
      break;
    case 1:
      actStatus.value = status.id;
      break;
    case 3:
      resignModal.value = true;
      editInfo.value["employee"].deactivation_status = 1;
      actStatus.value = status.id;
      break;
  }
};

const fetchDeactivationStatus = async () => {
  await hr_api.get("employee/deactivationStatus").then((response) => {
    deactStatus = response.data;
  });
};

const deactStatus = [];
const deactStatusOptions = ref(deactStatus);

const deactStatusFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    emStatusOptions.value = emStatus.filter(
      (v) => v.employment_status.toLowerCase().indexOf(needle) > -1
    );
  });
};

const emStatus = [
  {
    id: 1,
    employment_status: "REGULAR",
  },
  {
    id: 2,
    employment_status: "CONTRACTUAL",
  },
  {
    id: 3,
    employment_status: "PROBATIONARY",
  },
  {
    id: 4,
    employment_status: "PROJECT-BASE",
  },
  {
    id: 5,
    employment_status: "ON-CALL",
  },
];
const emStatusOptions = ref(emStatus);

const emStatusFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    emStatusOptions.value = emStatus.filter(
      (v) => v.employment_status.toLowerCase().indexOf(needle) > -1
    );
  });
};

const fetchPosition = async () => {
  const dept_id = departmentSelect.value.dept_id;
  console.log(dept_id);

  await hr_api
    .get("employee/position/department/" + dept_id)
    .then((response) => {
      const position = response.data;
      pos = [];
      for (const p in position) {
        pos.push(position[p]);
      }
    });
};

const positionFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    positionOptions.value = pos.filter(
      (v) => v.position.toLowerCase().indexOf(needle) > -1
    );
  });
};

const fetchDepartment = () => {
  const dept = departmentOptions.value;
  if (department.length == 0) {
    for (const d in dept) {
      department.push(dept[d]);
    }
  }
};
fetchDepartment();
fetchPosition();
fetchDeactivationStatus();
</script>

<style lang="scss" scoped></style>
