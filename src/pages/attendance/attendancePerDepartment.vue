<template>
  <div>
    <header-layout mainTitle="Time Attendance" moduleTitle="Per Department">
      <q-btn outline color="grey-8" to="/dashboard" label="Dashboard" />
    </header-layout>
    <q-separator spaced inset />
    <q-card v-if="!loading" class="q-pa-sm row justify-center">
      <div v-for="d in department" :key="d.dept_id" class="col-lg-3 gt-md">
        <q-card
          :class="attendance[d.dept_id] != 0 ? 'bg-positive text-white' : ''"
          class="my-card pointer q-mx-xs q-my-md row min-height"
          @click="loadDTS(d.dept_id)"
        >
          <q-card-section class="col-lg-8">
            <div class="text-h6">{{ d.department }}</div>
            <div class="text-subtitle2">Team Leader : {{ d.teamLeader }}</div>
          </q-card-section>
          <q-card-section class="col-lg-4">
            <div class="text-h4">{{ attendance[d.dept_id] }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- for mobile devices -->
      <div
        v-for="d in department"
        :key="d.dept_id"
        class="lt-lg col-md-6 col-sm-12 col-xs-12"
      >
        <q-card
          :class="attendance[d.dept_id] != 0 ? 'bg-positive text-white' : ''"
          class="my-card pointer q-mx-xs q-my-xs row min-height"
          @click="loadDTS(d.dept_id)"
        >
          <q-card-section class="col-md-6 col-xs-6">
            <div class="text-h6">{{ d.department }}</div>
            <div class="text-subtitle2">Team Leader : {{ d.teamLeader }}</div>
          </q-card-section>
          <q-card-section class="col-md-6 col-xs-6">
            <div class="text-h4 text-right q-mr-md">
              {{ attendance[d.dept_id] }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
    <q-card v-if="loading" class="my-card">
      <q-card-section>
        <q-inner-loading
          :showing="loading"
          label="Please wait..."
          label-class="text-black"
          label-style="font-size: 1.1em"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { LocalStorage } from "quasar";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../boot/axios";
import HeaderLayout from "../../layouts/HeaderLayout.vue";

const route = useRoute();
const router = useRouter();
const workplace = route.params.workplace;
const allDepartments = JSON.parse(LocalStorage.getItem("departments"));
const department = ref([]);
const attendance = ref([]);
const loading = ref(true);
let dept = {};

const fetchDepartments = async () => {
  for (const d in allDepartments) {
    if (
      allDepartments[d].workplace.id == workplace &&
      allDepartments[d].dept_id != 1
    ) {
      department.value.push({
        dept_id: allDepartments[d].dept_id,
        department: allDepartments[d].department,
        teamLeader: await getTeamLeader(allDepartments[d]),
      });
    }
  }
};

const fetchDepartmentAttendance = async () => {
  await api
    .get("attendance/per-department/" + workplace)
    .then(async (response) => {
      for (const d in department.value) {
        attendance.value[department.value[d].dept_id] = await filterAttendance(
          department.value[d].dept_id,
          response.data
        );
      }
      loading.value = false;
    });
};

const filterAttendance = (dept_id, details) => {
  const att = [];
  for (const d in details) {
    // console.log(details[d].employee.position.department.dept_id, dept_id);
    if (details[d].employee.position.department.dept_id == dept_id) {
      att.push(details[d]);
    }
  }

  return att.length;
};

const getTeamLeader = (department) => {
  console.log(department);
  const TL =
    department.teamLeader.length > 0
      ? department.teamLeader[0].profile.lastname +
        ", " +
        department.teamLeader[0].profile.firstname
      : "";

  console.log(TL);
  return TL;
};

const loadDTS = (dept_id) => {
  router.push("/attendance/dts/" + dept_id + "/" + workplace);
};

fetchDepartments();
fetchDepartmentAttendance();
</script>

<style lang="scss" scoped>
.min-height {
  min-height: 120px;
}
.pointer {
  cursor: pointer;
}
</style>
