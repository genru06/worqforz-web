<template>
  <div>
    <!-- <q-btn
      color="primary"
      icon="check"
      label="Socket Check"
      @click="socketCheck"
    /> -->
  </div>
</template>

<script setup>
import { LocalStorage } from "quasar";
import { useConstants } from "../stores/constants";
import { useRoute, useRouter } from "vue-router";
// import { useUserStore } from "../stores/user-store";
// import { useAttendanceStore } from "../stores/attendance";

const user = LocalStorage.getItem("user");
const is_tl = user.profile.employee.is_tl;
const router = useRouter();

if (is_tl) {
  router.push("/dashboard/time-keeper");
} else {
  constants.fetchAllWorkplace();
  constants.fetchDepartments();
}
console.log("is tl : ", is_tl);

const constants = useConstants();
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
