<template>
  <div class="row">
    <div class="col-lg-3 q-pa-sm">
      <q-card class="my-card">
        <q-bar dark class="bg-teal-3">
          <div class="col text-weight-bold text-center">
            Infraction Category / Section
          </div>
        </q-bar>
        <q-card-section class="q-pa-none">
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
              v-for="iS in infractionSections"
              :key="iS.id"
              :active="selected == iS.id"
              @click="getInfraction(iS.infractions, iS.section, iS.id)"
            >
              <q-item-section avatar top>
                <q-avatar icon="radio_button_unchecked" size="24px" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ iS.section }}</q-item-label>
                <q-item-label caption></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-lg-9 col-md-9 q-pa-sm">
      <q-card class="my-card">
        <q-bar dark class="bg-blue-300">
          <div class="col text-weight-bold text-center">
            Infraction List -
            <span class="text-negative">{{ sectionTitle }}</span>
          </div>
        </q-bar>
        <q-table
          :wrap-cells="true"
          dense
          separator="horizontal"
          :filter="filter"
          :loading="loading"
          :pagination="{
            rowsPerPage: 10,
          }"
          :rows-per-page-options="[10, 20, 50]"
          :rows="tablerows"
          :columns="columns"
          row-key="name"
        >
          <template #header-cell="props">
            <q-th :props="props" class="text-capitalize text-bold">
              {{ props.col.label.toUpperCase() }}
            </q-th>
          </template>
          <template #body-cell-da="props">
            <q-td :props="props">
              <q-list separator>
                <q-item
                  clickable
                  v-ripple
                  dense
                  v-for="da in props.row.da"
                  :key="da.id"
                >
                  <q-item-section
                    >{{ da.no_offense }})
                    {{ da.disciplinary_action }}</q-item-section
                  >
                </q-item>
              </q-list>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { hr_api } from "../../boot/axios";

// const infractionSections = ref({})

const props = defineProps({
  infractionSections: {},
});
const filter = ref("");
const tablerows = ref([]);
const selected = ref(1);
const sectionTitle = ref("");

const columns = [
  {
    name: "num",
    label: "#",
    align: "center",
    field: "num",
    style: "width:50px;",
    headerStyle: "width: 50px",
  },
  {
    name: "infractions",
    label: "Infractions",
    align: "left",
    field: "infractions",
    style: "width:500px;",
    headerStyle: "width: 500px",
  },
  {
    name: "da",
    label: "Disciplinary Action",
    align: "left",
    field: "da",
    style: "width:400px;",
    headerStyle: "width: 400px",
  },
];

const getInfraction = (details, section, id) => {
  console.log(section, id);
  let i = 0;
  tablerows.value = [];
  for (const d in details) {
    i++;
    const row = {
      id: details[d].id,
      num: i,
      infractions: details[d].infractions,
      catSec: section,
      da: details[d].disciplinaryAction,
    };
    tablerows.value.push(row);
    selected.value = id;
    sectionTitle.value = section;
  }
};

getInfraction(
  props.infractionSections.infractions,
  props.infractionSections.section,
  props.infractionSections.id
);
</script>

<style scoped></style>
