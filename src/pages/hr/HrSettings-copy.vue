<template>
  <div>
    <header-layout mainTitle="Human Resource Management" moduleTitle="Settings">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
    </header-layout>

    <div class="q-pa-md row q-gutter-md">
      <q-card class="my-card col-3">
        <q-card-section class="p-1">
          <q-toolbar>
            <q-toolbar-title class="p-0">List of Departments </q-toolbar-title>
            <q-btn-dropdown
              split
              color="red"
              push
              glossy
              no-caps
              icon="add"
              label="Add"
            >
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="addDepartmentForm = true"
                >
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
                    <q-avatar
                      icon="person"
                      color="secondary"
                      text-color="white"
                    />
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
          </q-toolbar>
        </q-card-section>
        <q-separator />
        <q-card-section class="department">
          <q-list
            class="rounded-borders q-py-none"
            separator
            dense
            :padding="true"
          >
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
      <q-card class="my-card col-3">
        <q-card-section class="p-1">
          <q-toolbar>
            <q-toolbar-title class="text-center"
              >List of Position
              <span class="text-subtitle1" v-if="positionList"
                >[ {{ selectedDepartment }} ]</span
              ><br />
              <span class="text-subtitle2" v-if="positionList"
                >Team Leader : {{ teamLeader }}
              </span>
            </q-toolbar-title>
          </q-toolbar>
        </q-card-section>
        <q-separator />
        <q-card-section class="department">
          <q-list
            class="rounded-borders q-py-none"
            separator
            dense
            :padding="true"
          >
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

    <q-dialog v-model="addDepartmentForm" persistent transition-show="scale">
      <q-card>
        <q-toolbar class="bg-white">
          <q-toolbar-title class="text-base">
            <span class="text-weight-bold">ADD</span> Department
            <span style="float: right">
              <q-btn
                flat
                round
                dense
                icon="close"
                class="text-sm"
                v-close-popup
              />
            </span>
          </q-toolbar-title>
        </q-toolbar>
        <q-separator />
        <q-card-section>
          <q-input
            dense
            v-model="departmentDetails.department"
            type="text"
            label="Department"
          />
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            dense
            v-model="departmentDetails.workplace"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="workplaceOptions"
            @filter="workplaceFn"
            label="Workplace :"
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
            @click="addDepartment"
            v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addPositionForm" persistent transition-show="scale">
      <q-card>
        <q-toolbar class="bg-white">
          <q-toolbar-title class="text-base">
            <span class="text-weight-bold">ADD</span> Position
            <span style="float: right">
              <q-btn
                flat
                round
                dense
                icon="close"
                class="text-sm"
                v-close-popup
              />
            </span>
          </q-toolbar-title>
        </q-toolbar>
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import { hr_api } from "boot/axios";

const $q = useQuasar();
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
const workplaceOptions = ref(workplace);

const getWorkplace = async () => {
  await hr_api.get("profile/workplace/all").then((response) => {
    for (const res in response.data) {
      const details = {
        label: response.data[res].name,
        value: response.data[res].id,
      };
      workplaceOptions.value.push(details);
    }
  });
};

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

getWorkplace();
getDepartments();
</script>
<style lang="scss" scoped>
.department {
  height: 70vh !important;
  overflow-y: scroll;
}
</style>
