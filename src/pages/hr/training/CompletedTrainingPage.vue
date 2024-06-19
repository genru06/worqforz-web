<template>
  <div>
    <HeaderLayout mainTitle="HR" moduleTitle="Completed Trainings">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn outline color="grey-8" to="/hr/training" label="Training Plan" />
      <q-btn
        outline
        color="grey-8"
        to="/hr/training/pending"
        label="Pending Trainings"
      />
      <q-btn
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
      <qcard class="q-pa-none">
        <div class="row">
          <div class="text-h6">Completed Trainings for Current Year</div>
          <q-space />
          <q-card-section class="col-lg-4 col-sm-12">
            <q-select
              v-model="trainingPlanSelect"
              :options="trainingPlanOptions"
              :option-label="(v) => v.title"
              :option-value="(v) => v.id"
              label="Select Training Plan"
              dense
              use-input
              hide-selected
              fill-input
              @filter="filterPlanTitleFN"
              @update:model-value="(v) => loadPlan(v)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-section class="col-12 row q-gutter-md">
            <q-input
              v-model="planType"
              type="text"
              class="col"
              label="Type"
              disable
              filled
              dense
            />
            <q-input
              v-model="conductedBy"
              type="text"
              class="col"
              label="Conducted By"
              dense
            />
            <q-input
              v-model="conductedIn"
              type="text"
              class="col"
              label="Conducted In"
              dense
            />
          </q-card-section>
        </div>
        <div class="q-mt-md">
          <div class="row">
            <q-space />
            <q-select
              class="col-lg-4 col-sm-12"
              v-model="departmentSelect"
              :options="departmentOptions"
              :option-label="(v) => v.department"
              option-value="id"
              label="Select Department"
              dense
              use-input
              fill-input
              hide-selected
              bg-color="white"
              @filter="departmentFn"
              @update:model-value="loadEmployeesPerDepartment"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <q-card-section class="row q-mt-lg">
          <div class="col-lg-5 q-pr-md">
            <q-card>
              <q-bar dark class="bg-grey-6 text-white">
                <div class="col text-weight-bold">List of Employees</div>
                <div class="col text-weight-bold text-right">
                  {{ deptParticipant }}
                </div>
              </q-bar>
              <q-card-section
                class="no-padding"
                style="max-height: 450px; min-height: 450px; overflow-y: scroll"
              >
                <q-list bordered separator>
                  <q-item clickable v-ripple v-for="e of employees" :key="e">
                    <q-item-section side top>
                      <q-checkbox
                        dense
                        v-model="selectedEmployees[e.employee_id]"
                        @click="selectOne(e)"
                      />
                    </q-item-section>
                    <q-item-section>{{ e.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-lg-1 items-center text-center column">
            <div class="col self-center">
              <q-btn color="primary" icon="forward" @click="addParticipant">
                <q-tooltip> Add Selected Employee </q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="col-lg-6 q-pl-sm">
            <q-card>
              <q-bar dark class="bg-green-6 text-white">
                <div class="col text-weight-bold">List of Participants</div>
                <div class="col text-weight-bold text-right">
                  {{ participants.length }} / {{ expectedParticipants }}
                </div>
              </q-bar>
              <q-card-section
                class="no-padding"
                style="max-height: 450px; min-height: 450px; overflow-y: scroll"
              >
                <q-list bordered separator>
                  <q-item clickable v-ripple v-for="p of participants" :key="p">
                    <q-item-section
                      ><span>{{ p.name }}</span> <q-space
                    /></q-item-section>
                    <q-item-section side top>
                      <q-item-label caption>{{
                        " [ " + p.department + " ]"
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </qcard>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { date, useQuasar } from "quasar";
import { hr_api } from "boot/axios";
import HeaderLayout from "../../../layouts/HeaderLayout.vue";

const $q = useQuasar();
const trainingPlanSelect = ref();
const trainingPlans = [];
const trainingPlanOptions = ref(trainingPlans);
const planType = ref();
const conductedBy = ref();
const conductedIn = ref();
const department = [];
const departmentOptions = ref(department);
const departmentSelect = ref();

const employees = ref([]);
const deptParticipant = ref(0);
const participants = ref([]);
const expectedParticipants = ref(0);
const selectedEmployees = ref({});
const selectedParticipants = ref([]);
const selectedParticipantsForm = ref([]);
let s = [];

const loadEmployeesPerDepartment = async (v) => {
  await hr_api.get("employee/department/" + v.id).then((response) => {
    for (const e of response.data) {
      const participant = checkIfParticipant(e.employee_id);
      if (!participant) {
        employees.value.push({
          employee_id: e.employee_id,
          name: (e.profile.lastname + ", " + e.profile.firstname).toUpperCase(),
          department: v.department,
        });
        selectedEmployees.value[e.employee_id] = false;
      } else {
        deptParticipant.value += 1;
      }
    }
  });
};

const addParticipant = async () => {
  console.log(selectedParticipants.value);
  await api
    .post("hr/training/participant/add", selectedParticipantsForm.value)
    .then((response) => {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Participant/s successfully Added",
        icon: "check",
      });
      for (const p of selectedParticipants.value) {
        participants.value.push(p);
      }
    });
  console.log(participants.value);
};

const selectOne = (v) => {
  selectedParticipantsForm.value = [];
  selectedParticipants.value = [];
  for (const sV in selectedEmployees.value) {
    if (selectedEmployees.value[sV] == true) {
      selectedParticipantsForm.value.push({
        employees: sV,
        trainingPlan: trainingPlanSelect.value["id"],
      });
      selectedParticipants.value.push(getSelectedEmployee(sV));
    }
  }
  console.log(
    employees.value,
    selectedParticipants.value,
    selectedParticipantsForm.value
  );
};

const getSelectedEmployee = (employee_id) => {
  const details = employees.value.filter((v) => v.employee_id == employee_id);

  return details[0];
};

const checkIfParticipant = (employee_id) => {
  const details = participants.value.filter(
    (v) => v.employee_id == employee_id
  );
  if (details.length > 0) {
    return true;
  }
  return false;
};

const departmentFn = async (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    departmentOptions.value = department.filter(
      (v) => v.department.toLowerCase().indexOf(needle) > -1
    );
  });
};

const loadPlan = async (v) => {
  planType.value = v.planType;
  conductedBy.value = v.conductedBy;
  conductedIn.value = v.conductedIn;
  expectedParticipants.value = v.expectedParticipants;
  const part = [];
  for (const p of v.participants) {
    part.push({
      employee_id: p.employees.employee_id,
      name: p.employees.profile.lastname + ", " + p.employees.profile.firstname,
      department: p.employees.position.department.department,
    });
  }
  participants.value = part;
};

const filterPlanTitleFN = async (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    trainingPlanOptions.value = trainingPlans.filter(
      (v) => v.title.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getAllTrainingPlans = async () => {
  await hr_api.get("hr/training/plan/all").then((response) => {
    for (const res of response.data) {
      trainingPlans.push({
        title:
          res.tp_training_title +
          "[ " +
          date.formatDate(res.tp_date, "MMMM DD, YYYY") +
          " ]",
        id: res.tp_id,
        conductedBy: res.tp_conducted_by,
        conductedIn: res.tp_conducted_in,
        expectedParticipants: res.tp_expected_participants,
        planType: res.trainingType.type,
        participants: res.participants,
      });
    }
  });
};
const getDepartment = async () => {
  await hr_api.get("employee/department/all").then((response) => {
    for (const d of response.data) {
      department.push({
        id: d.dept_id,
        department: d.department,
      });
    }
  });
};
getDepartment();
getAllTrainingPlans();
</script>

<style lang="scss" scoped></style>
