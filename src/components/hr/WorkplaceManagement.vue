<template>
  <div class="row">
    <div class="text-h4 q-mb-md">Workplace / Sites</div>
    <q-table
      class="col-lg-12"
      :rows="tableRows"
      :columns="columns"
      row-key="name"
      dense
      :pagination="{
        rowsPerPage: 20,
      }"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:top-right="">
        <q-btn
          color="primary"
          icon="add"
          label="Add Workplace"
          @click="addWorkplaceModal = true"
        />
      </template>
    </q-table>
    <q-dialog v-model="addWorkplaceModal">
      <q-card>
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add Workplace</div>
        </q-bar>
        <q-card-section class="row">
          <q-input
            class="col-lg-12"
            dense
            v-model="workplace.name"
            type="text"
            label="Workplace Name"
            :rules="[
              (val) => (val && val.length > 0) || 'Workplace Name is Required',
            ]"
          />
          <q-input
            class="col-lg-12"
            dense
            v-model="workplace.address"
            type="text"
            label="Address"
            :rules="[(val) => (val && val.length > 0) || 'Address is Required']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="close" color="negative" v-close-popup />
          <q-btn
            flat
            label="submit"
            @click="submitWorkplace"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const tableRows = ref([]);
const addWorkplaceModal = ref(false);

const workplace = ref({
  name: "",
  address: "",
});

const columns = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: "id",
  },
  {
    name: "name",
    required: true,
    label: "Workplace",
    align: "left",
    field: "name",
  },
  {
    name: "address",
    required: true,
    label: "Address",
    align: "left",
    field: "address",
  },
];

const submitWorkplace = () => {
  hr_api.post("employee/workplace/add", workplace.value).then((response) => {
    $q.notify({
      color: response.data.status ? "positive" : "negative",
      position: "top",
      message: response.data.msg,
      icon: response.data.status ? "check" : "report_problem",
    });
  });
};

const getAllWorkplace = async () => {
  await hr_api.get("employee/workplace/all").then((response) => {
    tableRows.value = response.data;
  });
};

getAllWorkplace();
</script>

<style lang="scss" scoped></style>
