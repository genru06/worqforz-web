<template>
  <q-card>
    <q-bar dark class="bg-primary text-white">
      <div class="col text-left text-weight-bold">Generate Account</div>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-bar>
    <q-card-section class="q-pb-none">
      <q-card-section class="q-pa-none">
        <label
          >Username : <span class="text-bold">{{ username }}</span></label
        >
      </q-card-section>
      <q-card-section class="q-pa-none">
        <label
          >Password : <span class="text-bold">{{ password }}</span></label
        >
      </q-card-section>
      <q-card-section class="">
        <span class="row text-red justify-center"
          >Note: Please tell the user to change his / her password.</span
        >
      </q-card-section>
      <q-select
        dense
        v-model="formDetails.roles"
        multiple
        :options="positionOptions"
        option-label="position"
        use-chips
        stack-label
        label="Roles"
      />
      <q-card-section align="right" class="q-pb-md q-gutter-md">
        <q-btn label="SUBMIT USER" color="primary" @click="signUp">
          <template v-slot:loading> <q-spinner-facebook /> </template
        ></q-btn>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { LocalStorage, useQuasar } from "quasar";
import { auth_api, hr_api } from "src/boot/axios";
import { useConstants } from "src/stores/constants";
import { ref } from "vue";

const $q = useQuasar();
const submitting = ref(false);
const prop = defineProps({
  basicInfo: [],
});

const constants = useConstants();
constants.fetchDepartments();
console.log(constants.departments);
const username = (
  constants.getFirstLetters(prop.basicInfo.firstname) +
  "." +
  prop.basicInfo.lastname
).toLowerCase();

const password = constants.generatePassword();
const roles = prop.basicInfo.employee.roles
  ? prop.basicInfo.employee.roles.split(",")
  : [];
const positionOptions = [];

for (const d of constants.departments) {
  for (const p of d.position) {
    positionOptions.push(p.position);
  }
}

if (!roles.includes(prop.basicInfo.employee.position.position)) {
  roles.push(prop.basicInfo.employee.position.position);
}
const emit = defineEmits(["update"]);

const formDetails = ref({
  auth: {
    uname: username,
    pword: password,
  },
  roles: roles,
  clientId: LocalStorage.getItem("appId"),
});

const signUp = async () => {
  submitting.value = true;
  console.log(formDetails.value);
  await auth_api
    .post("auth/sign-up", formDetails.value)
    .then(async (response) => {
      if (response.status == 201) {
        const details = {
          basic: {
            user_id: prop.basicInfo.user_id,
            user: response.data.user.id,
          },
          employee: {
            roles: response.data.roles,
          },
        };
        await hr_api.patch(
          "employee/" + prop.basicInfo.employee.employee_id,
          details
        );
      }
      emit("update");
    })
    .catch((error) => {
      console.log(error.response);
      $q.notify({
        color: "negative",
        position: "top",
        message: error.response.data.message,
        icon: "warning",
      });
    });
};
</script>

<style lang="scss" scoped></style>
