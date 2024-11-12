<template>
  <div>
    <header-layout
      mainTitle="Human Resource Management"
      moduleTitle="List of Employees"
    >
      <q-btn outline color="grey-8" to="/hr/dashboard" label="Dashboard" />
      <q-btn
        outline
        color="grey-8"
        @click="employeeForm = true"
        label="Add Employee"
      />
      <q-btn outline color="grey-8" to="/settings" label="Settings" />

      <q-btn-dropdown
        outline
        auto-close
        rounded
        color="primary"
        :label="wLabel"
      >
        <!-- dropdown content goes here -->
        <q-list padding style="width: 350px">
          <q-item
            v-for="w of workplace"
            :key="w.id"
            clickable
            @click="getAllProfileByWorkplace(w.id, w.name)"
          >
            <q-item-section>
              <q-item-label>{{ w.name }}</q-item-label>
              <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </header-layout>
    <div class="q-pa-md">
      <q-dialog v-model="employeeForm" persistent transition-show="scale">
        <q-card style="width: 980px !important">
          <q-toolbar
            class="bg-white"
            style="position: fixed; z-index: 1000; width: 980px"
          >
            <q-toolbar-title>
              <span class="text-weight-bold">Add</span> Record
              <span style="float: right">
                <q-btn flat round dense icon="save" @click="onSubmitForm" />
                <q-btn flat round dense icon="close" v-close-popup />
              </span>
            </q-toolbar-title>
          </q-toolbar>

          <q-card-section class="q-mt-xl">
            <add-employee
              @close-add-form="employeeForm = false"
              ref="addEmployeeForm"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <div class="q-pa-md">
        <q-tabs
          v-model="tab"
          active-color="info"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="activeEmployees" label="Active Employees">
            <q-badge v-if="totalActiveEmployees != 0" color="positive">{{
              totalActiveEmployees
            }}</q-badge>
          </q-tab>
          <q-tab name="suspendedEmployees" label="Suspended Employees">
            <q-badge v-if="totalSuspendedEmployees != 0" color="negative">{{
              totalSuspendedEmployees
            }}</q-badge>
          </q-tab>
          <q-tab name="resignedEmployees" label="Resigned Employees">
            <q-badge v-if="totalResignedEmployees != 0" color="negative">{{
              totalResignedEmployees
            }}</q-badge>
          </q-tab>
          <q-tab name="deactivatedEmployees" label="Deactivated Employees">
            <q-badge v-if="totalDeactivatedEmployees != 0" color="negative">{{
              totalDeactivatedEmployees
            }}</q-badge>
          </q-tab>
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated class="w-full">
          <q-tab-panel class="q-pa-md row" name="activeEmployees">
            <EmployeeListGrid
              @total-employees="(v) => (totalActiveEmployees = v)"
              :profiles="profileList"
              emStatus="1"
              class="col"
            />
          </q-tab-panel>
          <q-tab-panel class="q-pa-md row" name="suspendedEmployees">
            <EmployeeListGrid
              @total-employees="(v) => (totalSuspendedEmployees = v)"
              emStatus="2"
              class="col"
            />
          </q-tab-panel>
          <q-tab-panel class="q-pa-md row" name="resignedEmployees">
            <EmployeeListGrid
              @total-employees="(v) => (totalResignedEmployees = v)"
              emStatus="3"
              class="col"
            />
          </q-tab-panel>
          <q-tab-panel class="q-pa-md row" name="deactivatedEmployees">
            <EmployeeListGrid
              @total-employees="(v) => (totalDeactivatedEmployees = v)"
              emStatus="0"
              class="col"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { LocalStorage, exportFile, useQuasar } from "quasar";
import { hr_api } from "boot/axios";
import AddEmployee from "../../components/hr/AddEmployee.vue";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import EmployeeListGrid from "../../components/hr/EmployeeListGrid.vue";

const $q = useQuasar();

const totalActiveEmployees = ref(0);
const totalSuspendedEmployees = ref(0);
const totalResignedEmployees = ref(0);
const totalDeactivatedEmployees = ref(0);
const tab = ref("activeEmployees");
const workplace = ref(LocalStorage.getItem("workplace"));
const wLabel = ref("Workplace");

const submitting = ref(false);
const employeeForm = ref(false);
const emStatus = ref(1);
const submitForm = ref(false);
const addEmployeeForm = ref();
const filteredSortedRows = ref();
const profileList = ref();

const getAllProfileByWorkplace = (workplace_id, wname) => {
  profileList.value = workplace_id;
  wLabel.value = wname;
  console.log(profileList.value);
};

const onSubmitForm = () => {
  addEmployeeForm.value.addEmployee();
};
</script>

<style lang="scss" scoped>
@media (min-width: 600px) {
  .q-dialog__inner--minimized > div {
    max-width: 980px;
  }
}

.formDialog {
  width: 980px !important;
}
</style>
