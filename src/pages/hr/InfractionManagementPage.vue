<template>
  <div>
    <HeaderLayout mainTitle="HR" moduleTitle="Infractions Management">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn outline color="grey-8" to="/hr/settings" label="Settings" />
      <q-btn
        outline
        color="grey-8"
        @click="addInfractionModal = true"
        label="Add Infraction"
      />
    </HeaderLayout>
    <q-separator />
    <div class="q-pa-md">
      <q-tabs
        v-model="tab"
        active-color="info"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="infractionList" label="Reported Violations">
          <q-badge v-if="isLoaded && infractionList[0]" color="negative">{{
            infractionList[0].length
          }}</q-badge>
        </q-tab>
        <q-tab name="nte" label="Notice to Explain">
          <q-badge v-if="isLoaded && infractionList[4]" color="positive">{{
            infractionList[4].length
          }}</q-badge>
        </q-tab>
        <q-tab name="we" label="Written Explaination">
          <q-badge v-if="isLoaded && infractionList[5]" color="positive">{{
            infractionList[5].length
          }}</q-badge>
        </q-tab>
        <q-tab name="ah" label="Admin Hearing">
          <q-badge v-if="isLoaded && infractionList[7]" color="positive">{{
            infractionList[7].length
          }}</q-badge>
        </q-tab>
        <q-tab name="nda" label="Notice of Disciplinary Action">
          <q-badge v-if="isLoaded && infractionList[9]" color="positive">{{
            infractionList[9].length
          }}</q-badge>
        </q-tab>
        <q-tab name="suspendedPersonel" label="Suspension">
          <q-badge v-if="isLoaded && infractionList[8]" color="positive">{{
            infractionList[8].length
          }}</q-badge>
        </q-tab>
        <q-tab name="status" label="Concluded Sanctions">
          <q-badge v-if="isLoaded && infractionList[1]" color="positive">{{
            infractionList[1].length
          }}</q-badge>
        </q-tab>
        <q-tab name="infractionSettings" label="Infraction Settings" />
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated class="w-full">
        <q-tab-panel class="row" name="infractionList">
          <ListOfViolationsVue
            v-if="isLoaded"
            :reportedViolations="infractionList[0]"
            @update-infraction-list="fetchInfractionList(true)"
          />
        </q-tab-panel>
        <q-tab-panel class="row" name="nte">
          <ListOfNTE
            v-if="isLoaded"
            :reportedViolations="infractionList[4]"
            @update-infraction-list="fetchInfractionList(true)"
          />
        </q-tab-panel>
        <q-tab-panel class="row" name="we">
          <ListOfWE
            v-if="isLoaded"
            :reportedViolations="infractionList[5]"
            @update-infraction-list="fetchInfractionList(true)"
          />
        </q-tab-panel>
        <q-tab-panel class="row" name="ah">
          <ListOfAH
            v-if="isLoaded"
            :infractionSections="infractionSections"
            :reportedViolations="infractionList[7]"
            @update-infraction-list="fetchInfractionList(true)"
          />
        </q-tab-panel>
        <q-tab-panel class="row" name="nda">
          <ListOfNod
            v-if="isLoaded"
            :infractionSections="infractionSections"
            :reportedViolations="infractionList[9]"
            @update-infraction-list="fetchInfractionList(true)"
          />
        </q-tab-panel>
        <q-tab-panel class="row" name="status">
          <ConcludedSanctions
            v-if="isLoaded"
            :reportedViolations="infractionList[1]"
          />
        </q-tab-panel>
        <q-tab-panel class="row" name="suspendedPersonel">
          <ListOfSuspendedPersonnel
            v-if="isLoaded"
            :reportedViolations="infractionList[8]"
            @update-infraction-list="fetchInfractionList(true)"
          />
        </q-tab-panel>
        <q-tab-panel class="q-pa-md" name="infractionSettings">
          <InfractionSettingsVue :infractionSections="infractionSections" />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="addInfractionModal" persistent>
      <addInfractions
        :infractionSections="infractionSections"
        @cancel="addInfractionModal = false"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import ListOfViolationsVue from "../../components/infractions/ListOfViolations.vue";
import ListOfNTE from "../../components/infractions/ListOfNTE.vue";
import ListOfNod from "../../components/infractions/ListOfNda.vue";
import ListOfWE from "../../components/infractions/ListOfWE.vue";
import ListOfAH from "../../components/infractions/ListOfAH.vue";
import ListOfSuspendedPersonnel from "../../components/infractions/ListOfSuspendedPersonnel.vue";
import InfractionSettingsVue from "../../components/infractions/InfractionSettings.vue";
import ConcludedSanctions from "../../components/infractions/ConcludedSanctions.vue";
import addInfractions from "src/components/infractions/addInfractions.vue";
import { hr_api } from "../../boot/axios";
import groupBy from "lodash/groupBy";
import { useQuasar } from "quasar";

const $q = useQuasar();
const infractionSections = ref({});
const infractionList = ref([]);
const isLoaded = ref(false);

const fetchInfractions = async () => {
  await hr_api.get("infraction/sections").then((response) => {
    infractionSections.value = response.data;
  });
  await fetchInfractionList();
};

const fetchInfractionList = async (isUpdate = false) => {
  if (isUpdate) {
    isLoaded.value = false;

    $q.notify({
      color: "positive",
      position: "top",
      message: "Infraction is Updated",
      icon: "done",
    });
  }
  await hr_api.get("infraction/violations").then(async (response) => {
    const details = await groupBy(response.data, (n) => {
      return n.status;
    });
    infractionList.value = details;
    isLoaded.value = true;
  });
};

fetchInfractions();

const addInfractionModal = ref(false);

const tab = ref("infractionList");
</script>

<style scoped></style>
