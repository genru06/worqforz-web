<template>
  <q-card class="q-pa-none" style="width: 500px">
    <q-bar dark class="bg-primary text-white">
      <div class="col text-left text-weight-bold">Edit Family Information</div>
      <q-btn flat round dense icon="save" @click="saveFamilyInfo" />
      <q-btn flat round dense icon="close" v-close-popup />
    </q-bar>
    <q-card-section>
      <q-input dense v-model="familyInfo.spouse" label="Spouse" />
      <q-input dense v-model="familyInfo.father" label="Father" />
      <q-input
        dense
        v-model="familyInfo.father_occupation"
        label="Father Occupation"
      />
      <q-input dense v-model="familyInfo.mother" label="Mother" />
      <q-input
        dense
        v-model="familyInfo.mother_occupation"
        label="Mother Occupation"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const props = defineProps({
  basic: {},
});

const emit = defineEmits(["update"]);

const familyDetails = JSON.parse(props.basic.family_details);

const familyInfo = ref({
  spouse: "",
  father: "",
  father_occupation: "",
  mother: "",
  mother_occupation: "",
});
if (familyDetails) {
  familyInfo.value = familyDetails;
}

const saveFamilyInfo = async () => {
  const details = {
    family_details: JSON.stringify(familyInfo.value),
  };
  await hr_api
    .patch("profile/family/" + props.basic.user_id, details)
    .then((response) => {
      if (response.status == 200) {
        emit("update");
      }
    });
};
</script>

<style lang="scss" scoped></style>
