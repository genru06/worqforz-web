<template>
  <div class="row q-pa-md">
    <div class="col-lg-6 col-sm-12">
      <OvertimeRequestList />
    </div>
  </div>
</template>

<script setup>
  import { LocalStorage } from "quasar";
  import { useConstants } from "../stores/constants";
  import { useRoute, useRouter } from "vue-router";
  import { ref } from "vue";
  import OvertimeRequestList from "src/components/OvertimeRequestList.vue";
  // import { useUserStore } from "../stores/user-store";
  // import { useAttendanceStore } from "../stores/attendance";

  const constants = useConstants();
  constants.fetchAllWorkplace();
  constants.fetchDepartments();
  const user = LocalStorage.getItem("user");
  if (user.roles != "SUPER") {
    const is_tl = user.profile.employee.is_tl;
    const router = useRouter();

    if (is_tl) {
      router.push("/dashboard/time-keeper");
    }
    console.log("is tl : ", is_tl);
  }

</script>

<style lang="scss" scoped>
  .pointer {
    cursor: pointer;
  }
</style>
