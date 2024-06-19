<template>
  <div class="row">
    <div class="col-lg-12 column items-end">
      <div class="col">
        <q-btn-dropdown color="primary" no-caps icon="add" label="Add">
          <q-list>
            <q-item clickable v-close-popup @click="addDepartmentForm = true">
              <q-item-section avatar>
                <q-avatar
                  icon="switch_account"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Department</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="addPositionForm = true">
              <q-item-section avatar>
                <q-avatar icon="person" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Position</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" color="amber" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <div class="row col-lg-12">
      <div class="col-lg-6 q-pa-sm">
        <q-card class="my-card">
          <q-card-section>
            <q-bar dark class="bg-white">
              <div class="col text-left text-weight-bold">
                List of Departments
              </div>
            </q-bar>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-list class="rounded-borders q-py-none" separator :padding="true">
              <q-item
                active-class="bg-primary text-white text-bold"
                clickable
                v-ripple
                v-for="dept in deptPos"
                :key="dept.dept_id"
                :active="selected == dept.dept_id"
                @click="getPosition(dept)"
              >
                <q-item-section avatar top>
                  <q-avatar icon="radio_button_unchecked" size="24px" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ dept.department }}</q-item-label>
                  <q-item-label caption></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-6 q-pa-sm">
        <q-card class="my-card col-lg-6 col-sm-12">
          <q-card-section class="p-1">
            <q-bar dark class="bg-white">
              <div class="col text-left text-weight-bold">
                List of Positions
              </div>
            </q-bar>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-list class="rounded-borders q-py-none" separator :padding="true">
              <q-item
                active-class="bg-primary text-white text-bold"
                clickable
                v-ripple
                v-for="pos in positionList"
                :key="pos.position_id"
              >
                <q-item-section avatar top>
                  <q-avatar icon="radio_button_unchecked" size="24px" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ pos.position }}</q-item-label>
                  <q-item-label caption></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="addDepartmentForm" persistent transition-show="scale">
      <q-card>
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add Department</div>
          <q-btn flat round dense icon="close" class="text-sm" v-close-popup />
        </q-bar>
        <q-separator />
        <q-card-section>
          <q-input
            dense
            v-model="departmentDetails.department"
            type="text"
            label="Department"
          />
        </q-card-section>
        <q-card-section class="column">
          <q-btn
            class="col self-end"
            color="green"
            icon="save"
            label="SAVE"
            @click="addDepartment"
            v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addPositionForm" persistent transition-show="scale">
      <q-card>
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add Position</div>
          <q-btn flat round dense icon="close" class="text-sm" v-close-popup />
        </q-bar>
        <q-separator />
        <q-card-section>
          <q-input
            dense
            v-model="positionDetails.position"
            type="text"
            label="Position"
          />
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            dense
            v-model="positionDetails.department"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="deptPos"
            option-label="department"
            @filter="departmentSearch"
            label="Department :"
            bg-color="white"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-section class="column">
          <q-btn
            class="col self-end"
            color="green"
            icon="save"
            label="SAVE"
            @click="addPosition"
            v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const expanded = ref([]);
const positionDetails = ref({
  position: "",
  department: 0,
});
const departmentDetails = ref({
  department: "",
});

const addDepartmentForm = ref();
const addPositionForm = ref();
const positionList = ref();
const selected = ref();
const selectedDepartment = ref();
const teamLeader = ref();
const deptPos = ref([]);

const getDepartments = async () => {
  await hr_api.get("employee/department/all").then((response) => {
    deptPos.value = response.data;
    selected.value = 1;
    getPosition(response.data[0]);
  });
};

const addDepartment = async () => {
  const data = {
    department: departmentDetails.value.department,
  };
  await hr_api.post("employee/department/add", data).then((response) => {
    deptPos.value = response.data;
    getPosition(response.data[0]);

    $q.notify({
      type: "positive",
      position: "top",
      message: "Department Successfully Added",
    });
  });
};

const addPosition = async () => {
  const data = {
    position: positionDetails.value.position,
    department: positionDetails.value.department,
  };
  await hr_api.post("employee/position/add", data).then((response) => {
    deptPos.value = response.data;
    selected.value = 1;
    getPosition(response.data[0]);

    $q.notify({
      type: "positive",
      position: "top",
      message: "Position Successfully Added",
    });
  });
};

const getPosition = (department) => {
  positionList.value = department.position;
  selectedDepartment.value = department.department;
  // teamLeader.value =
  //   department.teamLeader.length > 0
  //     ? department.teamLeader[0].profile.lastname +
  //       ", " +
  //       department.teamLeader[0].profile.firstname
  //     : "";
  selected.value = department.dept_id;
};

getDepartments();
</script>

<style lang="scss" scoped></style>
