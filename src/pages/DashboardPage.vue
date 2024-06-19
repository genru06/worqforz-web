<template>
  <div>
    <div class="row q-mt-md q-pa-md" v-if="loaded">
      <q-card
        v-for="wp in workplaceDetails"
        :key="wp.id"
        class="my-card col-lg col-sm-12 col-xs-12 row q-ma-sm pointer"
        @click="getAttendancePerDepartment(wp.id)"
      >
        <div :class="bgColor[wp.id - 1]" class="col-lg-8 col-xs-12">
          <q-card-section>
            <div class="text-h6">{{ wp.name }}</div>
            <div class="text-subtitle2">{{ wp.address }}</div>
          </q-card-section>
          <q-card-section class="text-center text-h2">
            {{ parseInt(wp.female) + parseInt(wp.male) }}
            <div class="text-subtitle2">EMPLOYEES</div>
          </q-card-section>
        </div>
        <q-card-section class="col-lg-4 col-xs-12">
          <div class="text-h6 text-center">Attendance</div>
          <div class="text-h5 text-center">
            {{ attendance[wp.id] }} /
            {{ parseInt(wp.female) + parseInt(wp.male) }}
          </div>
          <q-separator spaced />
          <div class="text-h6 text-center">Gender</div>
          <div class="row">
            <div class="text-h5 text-center col">
              {{ wp.male }} <br /><small>Male</small>
            </div>
            <q-separator spaced vertical inset color="warning" />
            <div class="text-h5 text-center col">
              {{ wp.female }} <br /><small>Female</small>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
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
// import { onBeforeMount, onMounted, ref } from "vue";
// import { useRouter } from "vue-router";
// import { api } from "../boot/axios";
import { useConstants } from "../stores/constants";
// import { useUserStore } from "../stores/user-store";
// import { useAttendanceStore } from "../stores/attendance";

const constants = useConstants();
constants.fetchAllWorkplace();
constants.fetchDepartments();
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
