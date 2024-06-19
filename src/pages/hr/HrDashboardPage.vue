<template>
  <div>
    <header-layout
      mainTitle="Human Resource Management"
      moduleTitle="Human Resource Management"
    >
      <q-btn outline color="grey-8" to="/dashboard" label="Dashboard" />
      <q-btn outline color="grey-8" to="/settings" label="Settings" />
    </header-layout>
    <div class="row">
      <div class="col-lg-4 col-xs-12 q-pa-sm">
        <router-link to="/hr/employee/list">
          <q-card class="bg-secondary text-primary">
            <q-card-section class="text-center"
              ><q-icon name="people" size="100px"></q-icon>
              <h4 class="q-my-none">Employee Masterlist</h4>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
      <div class="col-lg-4 col-xs-12 q-pa-sm">
        <router-link to="/hr/employee/infraction">
          <q-card class="bg-red text-center text-white">
            <q-card-section
              ><q-icon name="report" size="100px"></q-icon>
              <h4 class="q-my-none">Infraction</h4>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
      <div class="col-lg-4 col-xs-12 q-pa-sm">
        <router-link to="/hr/employee/leave">
          <q-card class="bg-warning text-center text-white">
            <q-card-section
              ><q-icon name="send" size="100px"></q-icon>
              <h4 class="q-my-none">Leave Details</h4>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
      <div class="col-lg col-xs-12 q-pa-sm">
        <router-link to="/hr/training">
          <q-card class="bg-positive text-center text-white">
            <q-card-section
              ><q-icon name="business_center" size="100px"></q-icon>
              <h4 class="q-my-none">Trainings</h4>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
      <div class="col-lg col-xs-12 q-pa-sm">
        <q-card class="bg-primary text-center text-white">
          <q-card-section
            ><q-icon name="history_edu" size="100px"></q-icon>
            <h4 class="q-my-none">Reports</h4>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderLayout from "../../layouts/HeaderLayout.vue";

import { useRoute } from "vue-router";

const route = useRoute();
console.log(route.query.token);

// temp only
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
