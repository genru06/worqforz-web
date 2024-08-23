<template>
  <div>
    <q-card class="my-card">
      <q-card-section class="row justify-center">
        <img style="width: 100%" src="../../assets/po_header.jpg" />
      </q-card-section>
    </q-card>
    <div class="bg-grey-3 q-gutter-md q-pa-md">
      <h4 class="text-center q-my-none q-mt-md">Hello {{ name }}!</h4>
    </div>
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section class="column q-pb-md items-center">
          <q-btn
            class="full-width"
            size="20px"
            label="CHECK ATTENDANCE"
            type="submit"
            color="primary"
            :loading="submitting"
            to="/scan"
          >
            <template v-slot:loading> <q-spinner-facebook /> </template
          ></q-btn>
        </q-card-section>
      </q-card>
      <q-card class="my-card q-mt-md">
        <q-card-section class="column q-pb-md items-center">
          <q-btn
            class="full-width"
            size="20px"
            label="View ATTENDANCE"
            type="submit"
            color="teal"
            :loading="submitting"
            :to="'/attendance/dts/' + workplace"
          >
            <template v-slot:loading> <q-spinner-facebook /> </template
          ></q-btn>
        </q-card-section>
      </q-card>
      <q-card class="my-card q-mt-md">
        <q-card-section class="column q-pb-md items-center">
          <q-btn
            class="full-width"
            size="20px"
            label="LOGOUT"
            type="submit"
            color="negative"
            :loading="submitting"
            @click="logout"
          >
            <template v-slot:loading> <q-spinner-facebook /> </template
          ></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { LocalStorage } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user-store";

const props = defineProps({
  appName: {
    type: String,
    default: "Company Name",
  },
});
const userStore = useUserStore();
const router = useRouter();
const name = ref(userStore.$state.name || "");
const user = LocalStorage.getItem("user");
const workplace = ref(user.profile.employee.workplace.id);

const logout = () => {
  userStore.clearUser();
  router.push("/login");
};
</script>
