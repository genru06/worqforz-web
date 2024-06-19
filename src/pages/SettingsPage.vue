<template>
  <div>
    <header-layout mainTitle="Human Resource Management" moduleTitle="Settings">
      <q-btn outline color="grey-8" to="/hr/dashboard" label="Dashboard" />
    </header-layout>
    <q-separator spaced inset />

    <div class="q-pa-md row q-gutter-md">
      <q-splitter
        class="col-lg-12"
        v-model="splitterModel"
        style="height: 73vh"
      >
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-primary">
            <q-tab name="globalSetting" label="Global Setting" />
            <q-tab name="workplace" label="Workplace" />
            <q-tab name="pd" label="Position / Department" />
            <q-tab name="payroll" label="Payroll" />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="globalSetting">
              <GlobalSettings />
            </q-tab-panel>

            <q-tab-panel name="workplace">
              <Workplace />
            </q-tab-panel>

            <q-tab-panel name="pd">
              <DepartmentPosition />
            </q-tab-panel>

            <q-tab-panel name="payroll">
              <PayrollSettings />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import HeaderLayout from "../layouts/HeaderLayout.vue";
import Workplace from "../components/hr/WorkplaceManagement.vue";
import DepartmentPosition from "../components/hr/DepartmentPositionManagement.vue";
import { hr_api } from "boot/axios";
import GlobalSettings from "../components/GlobalSettings.vue";
import PayrollSettings from "../components/payroll/PayrollSettings.vue";

const $q = useQuasar();
const tab = ref("globalSetting");
const expanded = ref([]);
const addDepartmentForm = ref();
const addPositionForm = ref();
const positionList = ref();
const selected = ref();
const selectedDepartment = ref();
const teamLeader = ref();
const positionDetails = ref({
  position: "",
  department: 0,
});
const departmentDetails = ref({
  department: "",
  workplace: 0,
});

const deptPos = ref([]);

// const departmentSearch = (val, update, abort) => {
//   update(() => {
//     const needle = val.toLowerCase();
//     deptPos.value = departmentDetails.value.department.filter(
//       (v) => v.department.toLowerCase().indexOf(needle) > -1
//     );
//   });
// };

const getPosition = (department) => {
  positionList.value = department.position;
  selectedDepartment.value = department.department;
  console.log(department.teamLeader);
  teamLeader.value =
    department.teamLeader.length > 0
      ? department.teamLeader[0].profile.lastname +
        ", " +
        department.teamLeader[0].profile.firstname
      : "";
  selected.value = department.dept_id;
};

const workplace = [];
// const workplaceOptions = ref(workplace);

// const getWorkplace = async () => {
//   await hr_api.get("profile/workplace/all").then((response) => {
//     for (const res in response.data) {
//       const details = {
//         label: response.data[res].name,
//         value: response.data[res].id,
//       };
//       workplaceOptions.value.push(details);
//     }
//   });
// };

const getDepartments = async () => {
  await hr_api.get("employee/department/all").then((response) => {
    deptPos.value = response.data;
  });
};

const addDepartment = async () => {
  const data = {
    department: departmentDetails.value.department,
    workplace: departmentDetails.value.workplace.value,
  };
  await hr_api.post("employee/department/add", data).then((response) => {
    deptPos.value = [];
    for (const res in response.data) {
      const child = [];
      const position = response.data[res].position;
      for (const pos in position) {
        child.push({
          label: position[pos].position,
        });
      }
      const details = {
        label: response.data[res].department,
        value: response.data[res].id,
        children: child,
      };
      deptPos.value.push(details);
    }
    expanded.value.push(positionDetails.value.department.value);

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
    department: positionDetails.value.department.value,
  };
  await hr_api.post("employee/position/add", data).then((response) => {
    deptPos.value = [];
    for (const res in response.data) {
      const child = [];
      const position = response.data[res].position;
      for (const pos in position) {
        child.push({
          label: position[pos].position,
        });
      }
      const details = {
        label: response.data[res].department,
        value: response.data[res].id,
        children: child,
      };
      deptPos.value.push(details);
    }
    expanded.value.push(positionDetails.value.department.value);

    $q.notify({
      type: "positive",
      position: "top",
      message: "Position Successfully Added",
    });
  });
};

// getWorkplace();
getDepartments();
</script>
<style lang="scss" scoped>
.department {
  height: 70vh !important;
  overflow-y: scroll;
}
</style>
