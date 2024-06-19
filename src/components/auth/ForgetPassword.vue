<template>
  <q-card style="width: 1000px; max-width: 20vw">
    <q-card-section class="q-pb-none">
      <q-form @submit="submitEmail" @reset="onReset">
        <q-card-section class="row justify-center">
          <img src="../assets/logo.png" />
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center">
          <span class="text-h5">Forgot Password?</span><br />
          <span class="text-center"
            >Please enter your email address and we will send you a link on how
            to reset your password.</span
          >
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-input
            outlined
            v-model="formDetails.email"
            type="text"
            label="Email"
            dense
            :rules="[(val) => (val && val.length > 0) || 'Email is Required']"
          />
        </q-card-section>

        <q-card-section align="center" class="q-pb-md q-gutter-md">
          <q-btn
            class="btnCase"
            label="Submit"
            type="submit"
            color="primary"
            :loading="submitting"
          >
            <template v-slot:loading> <q-spinner-facebook /> </template
          ></q-btn>
        </q-card-section>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { auth_api } from "src/boot/axios";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";

const emit = defineEmits(["close"]);
const $q = useQuasar();

const userStore = useUserStore();

const agree = ref(false);
const submitting = ref(false);
const formDetails = ref({
  email: "",
  password: "",
});

const submitEmail = async () => {
  $q.dialog({
    title: "Alert",
    message: "A link has been sent to this email.",
  }).onOk(() => {
    window.location.replace("http://18.224.227.92/");
    window.location.href = "http://18.224.227.92/";
  });
};
</script>

<style lang="scss" scoped></style>
